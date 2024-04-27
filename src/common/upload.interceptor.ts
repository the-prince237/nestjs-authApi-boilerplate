import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import * as fs from 'fs';
import {
  GraphQLArgument,
  GraphQLField,
  GraphQLResolveInfo,
  GraphQLType,
  getNamedType,
} from 'graphql';
import { FileUpload, GraphQLUpload, Upload } from 'graphql-upload';
import { join, parse } from 'path';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '../config/config.service';

function getResolverField(
  info: GraphQLResolveInfo,
): GraphQLField<any, any, { [key: string]: any }> {
  const { fieldName, parentType } = info;
  const typeFields = parentType.getFields();

  return typeFields[fieldName];
}

function getArgumentValue(args: { [key: string]: any }, arg: GraphQLArgument) {
  return args[arg.name];
}

function filterMapFieldArguments<T>(
  f: (definition: GraphQLArgument, arg: any) => Maybe<T>,
  info: GraphQLResolveInfo,
  args: { [key: string]: any },
): T[] {
  const field = getResolverField(info);
  const fieldArguments = field.args;

  const fWithArguments = (arg) => f(arg, getArgumentValue(args, arg));

  return filterMap(fWithArguments, fieldArguments);
}

function filterMap<T, U>(f: (x: T) => Maybe<U>, xs: readonly T[]): U[] {
  return xs.reduce((acc, x) => {
    const res = f(x);
    if (res !== null) {
      return [res, ...acc];
    } else {
      return acc;
    }
  }, []);
}

type Maybe<T> = T | null;

interface IUploadArgument {
  argumentName: string;
  upload: Upload | Upload[];
}

interface IProcessedUploadArgument<T> {
  argumentName: string;
  upload: T | T[];
}

declare type IUploadHandler<T> = (upload: FileUpload) => Promise<T>;

function uploadTypeIdentifier(
  def: GraphQLArgument,
  value: any,
): IUploadArgument {
  if (isGraphQLArgumentType(GraphQLUpload, def)) {
    return {
      argumentName: def.name,
      upload: value,
    };
  } else {
    return null;
  }
}

function isGraphQLArgumentType(
  type: GraphQLType,
  argument: GraphQLArgument,
): boolean {
  return getNamedType(argument.type).name === getNamedType(type).name;
}

function extractUploadArguments(
  args: { [key: string]: any },
  info: GraphQLResolveInfo,
): IUploadArgument[] {
  return filterMapFieldArguments(uploadTypeIdentifier, info, args);
}

function normaliseArguments<T>(args: IProcessedUploadArgument<T>[]): {
  [key: string]: T;
} {
  return args.reduce((acc, val) => {
    return {
      ...acc,
      [val.argumentName]: val.upload,
    };
  }, {});
}

function processor<T>(uploadHandler: IUploadHandler<T>) {
  return function ({
    argumentName,
    upload,
  }: IUploadArgument): Maybe<Promise<IProcessedUploadArgument<T>>> {
    if (Array.isArray(upload)) {
      const uploads = upload.reduce((acc, file) => {
        if (file !== undefined && file !== null && file.promise.then) {
          return [...acc, file.promise.then(uploadHandler)];
        } else {
          return acc;
        }
      }, []);

      return Promise.all(uploads).then((res) => ({
        argumentName: argumentName,
        upload: res,
      }));
    } else if (upload !== undefined && upload !== null && upload.promise.then) {
      return upload.promise.then(uploadHandler).then((res) => ({
        argumentName: argumentName,
        upload: res,
      }));
    } else {
      return null;
    }
  };
}

// function : image uploading
export const storeUpload = async (
  file: FileUpload,
): Promise<{ path: string; ext: string; uid: string }> => {
  const uid = uuidv4();
  const { createReadStream, filename } = file;
  const stream = createReadStream();
  const { ext } = parse(filename);

  const sharedDir = ConfigService.config.sharedDir;

  const path = join(sharedDir, `/${uid}${ext}`);

  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(path))
      .on('finish', () => resolve({ path, ext, uid }))
      .on('error', (error) => {
        fs.unlink(path, () => {
          reject(error);
        });
      }),
  );
};

@Injectable()
export class UploadInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    if (context.getType<GqlContextType>() === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      const args = gqlContext.getArgs();
      const info = gqlContext.getInfo();

      // const methodName = gqlContext.getHandler().name;
      // const className = gqlContext.getClass().name;

      const req = gqlContext.getContext().req;

      const uploadArguments = extractUploadArguments(args, info);
      const uploads = filterMap(processor(storeUpload), uploadArguments);

      const uploaded = await Promise.all(uploads);
      const argsUploaded = normaliseArguments(uploaded);

      const argsWithUploads = { ...args, ...argsUploaded };

      req.params = argsWithUploads;
      req.body.variables = argsWithUploads;
    }

    return next.handle();
  }
}
