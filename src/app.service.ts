import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './env.model';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService<EnvConfig>) {}

  getHello(): string {
    const appName = this.configService.get('APP_CONFIG_NAME', { infer: true });
    return `Hello World from ${appName}!`;
  }
}
