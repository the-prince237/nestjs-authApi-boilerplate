import { Config, Property } from 'ts-convict';
import { TConfigSchema } from './config.interfaces';

@Config({ validationMethod: 'strict' })
export class AppConfig implements TConfigSchema {
  @Property({
    doc: 'Port application listens on',
    default: 6005,
    env: 'PORT',
    format: 'port',
  })
  public port: number;

  @Property({ format: 'String', default: '/tmp', env: 'SHARED_DIR' })
  sharedDir: string;

  @Property({
    format: 'String',
    default: 'localbucket',
    env: 'S3_MEDIA_BUCKET',
  })
  mediaBucket: string;

  @Property({
    format: 'String',
    default: 'w3PDlfr0H2za8TU0',
    env: 'JWT_SECRET',
  })
  jwtSecretKey: string;

  @Property({
    format: 'String',
    default: 'https://durin-nest-auth-api.vercel.app',
    env: 'SITE_URL',
  })
  siteUrl: string;
}
