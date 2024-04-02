import { CatProfileSchema } from '@cat-fostering/entities';
import { OryRelationshipsService } from '@getlarge/keto-client-wrapper';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { adminRelationQuery, ownerRelationQuery } from './helpers';
import { CreateCatProfile } from './models/create-catprofile';
import { UpdateCatProfile } from './models/update-catprofile';

@Injectable()
export class CatProfilesService {
  readonly logger = new Logger(CatProfilesService.name);

  constructor(
    @InjectRepository(CatProfileSchema)
    private readonly catProfileRepository: Repository<CatProfileSchema>,
    @Inject(OryRelationshipsService)
    private readonly oryRelationshipsService: OryRelationshipsService
  ) {}

  find() {
    return this.catProfileRepository.find();
  }

  async findById(id: string) {
    const profile = await this.catProfileRepository.findOne({
      where: { id },
      relations: {
        owner: true,
      },
    });
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.NOT_FOUND);
    }
    return profile;
  }

  private async createAdminRelationship(catProfileId: string) {
    const createRelationshipBody = adminRelationQuery(catProfileId);
    await this.oryRelationshipsService.createRelationship({
      createRelationshipBody,
    });
  }

  private async createOwnerRelationship(catProfileId: string, userId: string) {
    const createRelationshipBody = ownerRelationQuery(catProfileId, userId);
    await this.oryRelationshipsService.createRelationship({
      createRelationshipBody,
    });
  }

  private async deleteAdminRelationship(catProfileId: string) {
    const deleteRelationshipBody = adminRelationQuery(catProfileId);
    await this.oryRelationshipsService.deleteRelationships(
      deleteRelationshipBody
    );
  }

  private async deleteOwnerRelationship(catProfileId: string, userId: string) {
    const deleteRelationshipBody = ownerRelationQuery(catProfileId, userId);
    await this.oryRelationshipsService.deleteRelationships(
      deleteRelationshipBody
    );
  }

  async create(body: CreateCatProfile, userId: string) {
    const queryRunner =
      this.catProfileRepository.manager.connection.createQueryRunner();
    let catProfile = queryRunner.manager.create(CatProfileSchema, {
      ...body,
      owner: { id: userId },
    });
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      catProfile = await queryRunner.manager.save(catProfile);
      await this.createAdminRelationship(catProfile.id);
      await this.createOwnerRelationship(catProfile.id, userId);
      await queryRunner.commitTransaction();
      return catProfile;
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      if (catProfile.id) {
        await this.deleteOwnerRelationship(catProfile.id, userId);
        await this.deleteAdminRelationship(catProfile.id);
      }
      throw new HttpException(
        'Failed to create cat profile',
        HttpStatus.BAD_REQUEST
      );
    } finally {
      await queryRunner.release();
    }
  }

  async updateById(id: string, body: UpdateCatProfile) {
    const catProfile = await this.findById(id);
    return this.catProfileRepository.save({
      ...catProfile,
      ...body,
    });
  }

  // TODO: wrap in transaction
  async deleteById(id: string): Promise<{ id: string }> {
    const catProfile = await this.findById(id);
    await this.deleteOwnerRelationship(id, catProfile.owner.id);
    await this.deleteAdminRelationship(id);
    await this.catProfileRepository.remove(catProfile);
    return { id };
  }
}
