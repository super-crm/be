import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { GithubApiService } from './github-api.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get('GITHUB_API_BASE_URL'),
        headers: {
          Authorization: `token ${configService.get('GITHUB_API_TOKEN')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [GithubApiService],
  exports: [GithubApiService],
})
export class GitHubApiModule {}
