import { Injectable } from '@nestjs/common';
import { TSConvict } from 'ts-convict';
import { TConfigSchema } from './config.interfaces';
import { AppConfig } from './config.schema';

@Injectable()
export class ConfigService {
  static config: AppConfig;
  constructor() {
    const configLoader = new TSConvict<TConfigSchema>(AppConfig);
    ConfigService.config = configLoader.load();
  }
}
