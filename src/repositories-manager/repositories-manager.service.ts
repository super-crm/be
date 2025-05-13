import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RepositoriesService } from '../repositories/repositories.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { GithubApiService } from '../github-api/github-api.service';
import { Repository } from '@prisma/client';

@Injectable()
export class RepositoriesManagerService {
  constructor(
    private readonly repositoriesService: RepositoriesService,
    private readonly githubApiService: GithubApiService,
  ) {}

  async create(createRepositoryDto: CreateRepositoryDto, userId: string) {
    const repositoryFields = await this.getGitHubRepositoryAndMapFields(
      createRepositoryDto.path,
    );

    return await this.repositoriesService.create({
      userId,
      ...repositoryFields,
    });
  }

  async findAll(userId: string) {
    return await this.repositoriesService.findAll(userId);
  }

  async findOne(repositoryId: string, userId: string) {
    return await this.findRepositoryAndValidateUserPermissions(
      repositoryId,
      userId,
    );
  }

  async update(repositoryId: string, userId: string) {
    const existingRepository =
      await this.findRepositoryAndValidateUserPermissions(repositoryId, userId);
    const repositoryPath = `${existingRepository.owner}/${existingRepository.name}`;

    const repositoryFields = await this.getGitHubRepositoryAndMapFields(
      repositoryPath,
    );

    return await this.repositoriesService.update(
      repositoryId,
      repositoryFields,
    );
  }

  async remove(repositoryId: string, userId: string) {
    await this.findRepositoryAndValidateUserPermissions(repositoryId, userId);

    return await this.repositoriesService.remove(repositoryId);
  }

  private async getGitHubRepositoryAndMapFields(
    repositoryPath: string,
  ): Promise<Omit<Repository, 'id' | 'createdAt' | 'updatedAt' | 'userId'>> {
    const githubRepository = await this.githubApiService.getRepository(
      repositoryPath,
    );

    return {
      owner: githubRepository.owner.login,
      forks: githubRepository.forks_count,
      issues: githubRepository.open_issues_count,
      stars: githubRepository.stargazers_count,
      name: githubRepository.name,
      url: githubRepository.html_url,
      dateOfCreation: new Date(githubRepository.created_at),
    };
  }

  private async findRepositoryAndValidateUserPermissions(
    repositoryId: string,
    userId: string,
  ) {
    const existingRepository = await this.repositoriesService.findOne(
      repositoryId,
    );

    if (!existingRepository) {
      throw new NotFoundException();
    }

    if (existingRepository.userId !== userId) {
      throw new ForbiddenException();
    }

    return existingRepository;
  }
}
