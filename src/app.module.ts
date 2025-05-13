import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { configSchema } from './config/config.schema';
import { IsUserAlreadyExistsConstraint } from './auth/validators/is-user-already-exists';
import { RepositoriesModule } from './repositories/repositories.module';
import { RepositoriesManagerModule } from './repositories-manager/repositories-manager.module';
import { GitHubApiModule } from './github-api/github-api.module';

const validationConstraints = [IsUserAlreadyExistsConstraint];

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configSchema,
    }),
    UsersModule,
    AuthModule,
    RepositoriesModule,
    RepositoriesManagerModule,
    GitHubApiModule,
  ],
  providers: validationConstraints,
})
export class AppModule {}
