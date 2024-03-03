import { TextWriter } from '@yellicode/core';
import { Generator } from '@yellicode/templating';
import { ClassDefinition, TypeScriptWriter } from '@yellicode/typescript';
import * as _ from 'lodash';
import * as pluralize from 'pluralize';

const generate = async () => {
  const model: any = await Generator.getModel();

  model.entities.forEach(
    (entity: {
      name: string;
      filterArgs?: [{ name: string; decorator: string; typeName: string }];
    }) => {
      const kebabName = _.kebabCase(entity.name);
      const plural = pluralize(entity.name);
      const pluralCamel = _.camelCase(plural);
      const pluralKebab = pluralize(kebabName);

      Generator.generate(
        {
          outputFile: `../../apollo/${pluralKebab}/@generated/dto/${kebabName}.admin.filter.ts`,
        },
        (output: TextWriter) => {
          const ts = new TypeScriptWriter(output);

          const inputClassDefinition: ClassDefinition = {
            name: `${entity.name}AdminFilter`,
            export: true,
          };

          ts.writeImports('@nestjs/graphql', ['Field', 'Int', 'InputType']);

          ts.writeLine();

          ts.writeLine(`@InputType()`);
          ts.writeClassBlock(inputClassDefinition, () => {
            ts.writeLine('@Field(() => Int, { nullable: true })');
            ts.writeProperty({ name: 'id', typeName: 'number' });

            ts.writeLine('@Field({ nullable: true })');
            ts.writeProperty({ name: 'q', typeName: 'string' });

            entity.filterArgs?.forEach((f) => {
              ts.writeLine(f.decorator);
              ts.writeProperty({ name: f.name, typeName: f.typeName });
            });
          });
        },
      );

      Generator.generate(
        {
          outputFile: `../../apollo/${pluralKebab}/@generated/dto/${kebabName}.admin.args.ts`,
        },
        (output: TextWriter) => {
          const ts = new TypeScriptWriter(output);

          const argsClassDefinition: ClassDefinition = {
            name: `${entity.name}AdminArgs`,
            export: true,
          };

          ts.writeImports('@nestjs/graphql', ['Field', 'Int', 'ArgsType']);
          ts.writeImports('src/@generated/typegraphql', ['SortOrder']);
          ts.writeImports(`./${kebabName}.admin.filter`, [
            `${entity.name}AdminFilter`,
          ]);

          ts.writeLine(`@ArgsType()`);
          ts.writeClassBlock(argsClassDefinition, () => {
            ts.writeLine('@Field(() => Int, { nullable: true })');
            ts.writeProperty({ name: 'page', typeName: 'number' });

            ts.writeLine('@Field(() => Int, { nullable: true })');
            ts.writeProperty({ name: 'perPage', typeName: 'number' });

            ts.writeLine('@Field({ nullable: true })');
            ts.writeProperty({ name: 'sortField', typeName: 'string' });

            ts.writeLine('@Field({ nullable: true })');
            ts.writeProperty({ name: 'sortOrder', typeName: 'SortOrder' });

            ts.writeLine(
              `@Field(() => ${entity.name}AdminFilter, { nullable: true })`,
            );
            ts.writeProperty({
              name: 'filter',
              typeName: `${entity.name}AdminFilter`,
            });
          });
        },
      );

      Generator.generate(
        {
          outputFile: `../../apollo/${pluralKebab}/@generated/${pluralKebab}.hook.ts`,
        },
        (output: TextWriter) => {
          const HookClassDefinition: ClassDefinition = {
            name: `${plural}Hook`,
            export: true,
            implements: [`SubjectBeforeFilterHook<${entity.name}, Request>`],
          };

          const ts = new TypeScriptWriter(output);
          ts.writeImports('@nestjs/common', ['Injectable']);

          ts.writeImports('nest-casl', ['Request', 'SubjectBeforeFilterHook']);
          ts.writeImports(`../${pluralKebab}.service`, [`${plural}Service`]);
          ts.writeImports(`../entities/${kebabName}.entity`, [
            `${entity.name}`,
          ]);

          ts.writeImports(`../../types/ProductQueryArgs`, ['SlugOrUid']);

          ts.writeLine(`@Injectable()`);
          ts.writeClassBlock(HookClassDefinition, () => {
            ts.writeLine(
              `constructor(private readonly ${pluralCamel}Service: ${plural}Service) {}`,
            );

            ts.writeFunctionBlock(
              {
                name: `async run`,
                returnTypeName: `Promise<${entity.name}>`,
                parameters: [
                  {
                    name: `{ params }`,
                    typeName: 'Request',
                  },
                ],
              },
              () => {
                ts.writeLine(
                  `
                let args: SlugOrUid;
                if ('id' in params) {
                  args = { id: params.id };
                } else if ('gid' in params) {
                  args = { gid: params.gid };
                } else if ('urlSlug' in params) {
                  args = { urlSlug: params.urlSlug };
                }

                return await this.${pluralCamel}Service.find${entity.name}(args);`,
                );
              },
            );
          });
        },
      );

      Generator.generate(
        {
          outputFile: `../../apollo/${pluralKebab}/@generated/${pluralKebab}.admin.resolver.ts`,
        },
        (output: TextWriter) => {
          const resolverClassDefinition: ClassDefinition = {
            name: `${plural}AdminCrud`,
            export: true,
          };

          const ts = new TypeScriptWriter(output);
          ts.writeImports('@nestjs/graphql', [
            'Resolver',
            'Query',
            'Mutation',
            'Args',
            'Int',
          ]);

          ts.writeImports('@nestjs/common', ['UseGuards']);

          ts.writeImports('nest-casl', [
            'AccessGuard',
            'Actions',
            'UseAbility',
          ]);

          ts.writeImports('../../auth/auth.guard', ['JwtAuthGuard']);

          ts.writeLine();

          ts.writeImports(`../entities/${kebabName}.entity`, [
            `${entity.name}`,
          ]);

          ts.writeImports(`../${pluralKebab}.service`, [`${plural}Service`]);
          ts.writeImports(`./${pluralKebab}.hook`, [`${plural}Hook`]);

          ts.writeImports('../../types/ListMetadata', ['ListMetadata']);

          ts.writeImports(`./dto/${kebabName}.admin.args`, [
            `${entity.name}AdminArgs`,
          ]);

          ts.writeLine();

          ts.writeLine(`@Resolver(() => ${entity.name})`);
          ts.writeClassBlock(resolverClassDefinition, () => {
            ts.writeLine(
              `constructor(private readonly ${pluralCamel}Service: ${plural}Service) {}`,
            );
            ts.writeLine(`@Query(() => ${entity.name})`);
            ts.writeFunctionBlock(
              {
                name: `async ${entity.name}`,
                returnTypeName: `Promise<${entity.name}>`,
                parameters: [
                  {
                    name: `@Args("id", { type: () => Int }) id`,
                    typeName: 'number',
                  },
                ],
              },
              () => {
                ts.writeLine(
                  `return await this.${pluralCamel}Service.findOne(id);`,
                );
              },
            );

            ts.writeLine();

            ts.writeLine(
              `@Query(() => [${entity.name}], {nullable: "itemsAndList"})`,
            );
            ts.writeFunctionBlock(
              {
                name: `async all${plural}`,
                returnTypeName: `Promise<${entity.name}[]>`,
                parameters: [
                  {
                    name: `@Args() args`,
                    typeName: `${entity.name}AdminArgs`,
                  },
                ],
              },
              () => {
                ts.writeLine(
                  `return await this.${pluralCamel}Service.getAllUsingOffsetPagination(args);`,
                );
              },
            );

            ts.writeLine();

            ts.writeLine(`@Query(() => ListMetadata, {nullable: true})`);
            ts.writeFunctionBlock(
              {
                name: `async _all${plural}Meta`,
                returnTypeName: 'Promise<{count: number}>',
                parameters: [
                  {
                    name: `@Args() args`,
                    typeName: `${entity.name}AdminArgs`,
                  },
                ],
              },
              () => {
                ts.writeLine(
                  `const count = await this.${pluralCamel}Service.getAllCount(args);;`,
                );
                ts.writeLine(`return { count };`);
              },
            );

            ts.writeLine();

            ts.writeLine(`@Mutation(() => ${entity.name})`);
            ts.writeLine(`@UseGuards(JwtAuthGuard, AccessGuard)`);
            ts.writeLine(
              `@UseAbility(Actions.delete, ${entity.name}, ${plural}Hook)`,
            );
            ts.writeFunctionBlock(
              {
                name: `async delete${entity.name}`,
                returnTypeName: `Promise<${entity.name}>`,
                parameters: [
                  {
                    name: `@Args("id", { type: () => Int }) id`,
                    typeName: 'number',
                  },
                ],
              },
              () => {
                ts.writeLine(`return this.${pluralCamel}Service.remove(id);`);
              },
            );
          });
        },
      );
    },
  );
};

generate();
