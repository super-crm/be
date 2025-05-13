import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class RepositoriesService {
  private readonly logger = new Logger(RepositoriesService.name);

  constructor(private prisma: PrismaService) {}

  async create(data: Omit<Repository, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      return await this.prisma.repository.create({
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            'Creation of new repository failed due to unique constrain violation. Repository:',
            data,
          );

          throw new BadRequestException('Repository already exists');
        }
      }
      throw error;
    }
  }

  async findAll(userId: string) {
    return await this.prisma.repository.findMany({ where: { userId } });
  }

  async findOne(id: string) {
    return await this.prisma.repository.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    repositoryUpdate: Partial<
      Omit<Repository, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
    >,
  ) {
    return await this.prisma.repository.update({
      where: { id },
      data: repositoryUpdate,
    });
  }

  async remove(id: string) {
    return await this.prisma.repository.delete({ where: { id } });
  }
}
