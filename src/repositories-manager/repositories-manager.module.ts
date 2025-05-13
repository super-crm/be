import { Module } from '@nestjs/common';

import { RepositoriesManagerService } from './repositories-manager.service';
import { RepositoriesManagerController } from './repositories-manager.controller';
import { RepositoriesModule } from '../repositories/repositories.module';
import { GitHubApiModule } from '../github-api/github-api.module';

@Module({
  imports: [RepositoriesModule, GitHubApiModule],
  controllers: [RepositoriesManagerController],
  providers: [RepositoriesManagerService],
})
export class RepositoriesManagerModule {}
