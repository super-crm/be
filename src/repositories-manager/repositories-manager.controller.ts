import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { RepositoriesManagerService } from './repositories-manager.service';
import { CreateRepositoryDto } from './dto/create-repository.dto';
import { AuthenticatedUser } from '../auth/decorators/authenticated-user.decorator';

@Controller('repositories')
export class RepositoriesManagerController {
  constructor(
    private readonly repositoriesManagerService: RepositoriesManagerService,
  ) {}

  @Post()
  async create(
    @Body() createRepositoryDto: CreateRepositoryDto,
    @AuthenticatedUser() user: User,
  ) {
    return await this.repositoriesManagerService.create(
      createRepositoryDto,
      user.id,
    );
  }

  @Get()
  async findAll(@AuthenticatedUser() user: User) {
    return await this.repositoriesManagerService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @AuthenticatedUser() user: User) {
    return await this.repositoriesManagerService.findOne(id, user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @AuthenticatedUser() user: User) {
    return await this.repositoriesManagerService.update(id, user.id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @AuthenticatedUser() user: User) {
    return await this.repositoriesManagerService.remove(id, user.id);
  }
}
