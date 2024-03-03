import { Generator } from '@yellicode/templating';
import { Project } from 'ts-morph';

Generator.getModel().then((model: any) => {
  const project = new Project({
    tsConfigFilePath: '../../../tsconfig.json',
  });

  model.classes.forEach(
    (entity: {
      names: [{ path: string; className: string }];
      omit: string[];
      override: [
        {
          name: string;
          newType: string;
          isRequired: boolean;
          decorator: { name: string; arguments: string[] };
        },
      ];
    }) => {
      entity.names.forEach((name) => {
        const { path, className } = name;
        const sourceFile = project.getSourceFile(
          `../../../src/@generated/typegraphql/${path}.ts`,
        );

        const argsSourceFile = project.createSourceFile(
          `../../../src/@generated/typegraphql/${path}Args.ts`,
          sourceFile.getStructure(),
          { overwrite: true },
        );

        argsSourceFile.addImportDeclaration({
          moduleSpecifier: 'graphql-upload',
          namedImports: ['Upload', 'GraphQLUpload'],
        });

        argsSourceFile.addImportDeclaration({
          moduleSpecifier: '@nestjs/graphql',
          namedImports: ['ArgsType'],
        });

        argsSourceFile.addImportDeclaration({
          moduleSpecifier: 'graphql-scalars',
          defaultImport: 'GraphQLScalars',
        });

        argsSourceFile.addStatements(
          "import * as CustomGraphQLScalars from '../../../../scalars';",
        );

        argsSourceFile.addStatements("import * as GraphqlInputs from './';");
        argsSourceFile.addStatements(
          "import * as CustomGraphqlInputs from './yellicode';",
        );

        const sourceClass = argsSourceFile.getClass(`${className}`);

        sourceClass.addDecorator({
          name: 'ArgsType',
          arguments: [],
        });

        entity.omit?.forEach((om) => {
          sourceClass.getProperty(om).remove();
        });

        entity.override?.forEach((ov) => {
          sourceClass.getProperty(ov.name).remove();
          sourceClass.addProperty({
            name: ov.name,
            type: ov.newType,
            hasExclamationToken: ov.isRequired,
            hasQuestionToken: !ov.isRequired,
            decorators: [
              { name: ov.decorator.name, arguments: ov.decorator.arguments },
            ],
          });
        });

        argsSourceFile.organizeImports();
      });
    },
  );

  const indexSourceFile = project.createSourceFile(
    `../../../src/@generated/typegraphql/yellicode.ts`,
    null,
    { overwrite: true },
  );

  model.classes.forEach(
    (entity: { names: [{ path: string; className: string }] }) => {
      entity.names.forEach((name) => {
        const { path, className } = name;
        indexSourceFile.addStatements(
          `export { ${className} } from './${path}Args';`,
        );
      });
    },
  );

  indexSourceFile.organizeImports();

  project.saveSync();
});
