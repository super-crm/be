import {
  BadGatewayException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

import { catchError, lastValueFrom, map } from 'rxjs';
import { IGithubRepository } from './interfaces/github-repository.response.interface';

@Injectable()
export class GithubApiService {
  private readonly logger = new Logger(GithubApiService.name);

  constructor(private readonly httpClient: HttpService) {}

  async getRepository(repositoryPath: string): Promise<IGithubRepository> {
    return await lastValueFrom(
      this.httpClient.get<IGithubRepository>(`repos/${repositoryPath}`).pipe(
        map(({ data }) => data),
        catchError((error: AxiosError<{ status: string; message: string }>) => {
          const errorResponse = error.response.data;
          this.logger.error(
            `Request to GET repos/${repositoryPath} failed. Error response:`,
            errorResponse,
          );

          if (errorResponse.status === HttpStatus.NOT_FOUND.toString()) {
            throw new NotFoundException('Repository not found');
          }

          throw new BadGatewayException(
            `Can not receive response from Github API. Message: ${errorResponse.message}`,
          );
        }),
      ),
    );
  }
}
