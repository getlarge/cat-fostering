import {
  CatProfileSchema,
  FosteringSchema,
  FosteringStatus,
} from '@cat-fostering/entities';
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

import { catProfileRelationQuery, participantRelationQuery } from './helpers';
import { RequestFostering } from './models/request-fostering';

@Injectable()
export class FosteringService {
  readonly logger = new Logger(FosteringService.name);

  constructor(
    @InjectRepository(FosteringSchema)
    private readonly fosteringRepository: Repository<FosteringSchema>,
    @Inject(OryRelationshipsService)
    private readonly oryRelationshipsService: OryRelationshipsService
  ) {}

  find(userId: string) {
    return this.fosteringRepository.find({
      where: [
        { participant: { id: userId } },
        { catProfile: { owner: { id: userId } } },
      ],
    });
  }

  async findById(id: string) {
    const fostering = await this.fosteringRepository.findOne({
      where: { id },
      relations: {
        participant: true,
        catProfile: true,
      },
    });
    if (!fostering) {
      throw new HttpException('Fostering not found', HttpStatus.NOT_FOUND);
    }
    return fostering;
  }

  private async createParticipantRelationship(
    fosteringId: string,
    userId: string
  ) {
    const createRelationshipBody = participantRelationQuery(
      fosteringId,
      userId
    );
    await this.oryRelationshipsService.createRelationship({
      createRelationshipBody,
    });
  }

  private async createCatProfileRelationship(
    fosteringId: string,
    catProfileId: string
  ) {
    const createRelationshipBody = catProfileRelationQuery(
      fosteringId,
      catProfileId
    );
    await this.oryRelationshipsService.createRelationship({
      createRelationshipBody,
    });
  }

  private async deleteParticipantRelationship(
    catProfileId: string,
    userId: string
  ) {
    const deleteRelationshipBody = participantRelationQuery(
      catProfileId,
      userId
    );
    await this.oryRelationshipsService.deleteRelationships(
      deleteRelationshipBody
    );
  }

  private async deleteCatProfileRelationship(
    fosteringId: string,
    catProfileId: string
  ) {
    const deleteRelationshipBody = catProfileRelationQuery(
      fosteringId,
      catProfileId
    );
    await this.oryRelationshipsService.deleteRelationships(
      deleteRelationshipBody
    );
  }

  async request(body: RequestFostering, userId: string) {
    const { catProfileId } = body;
    const queryRunner =
      this.fosteringRepository.manager.connection.createQueryRunner();
    let fostering = queryRunner.manager.create(FosteringSchema, {
      ...body,
      status: FosteringStatus.PENDING,
      catProfile: { id: catProfileId },
      participant: { id: userId },
    });

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.findOneOrFail(CatProfileSchema, {
        where: { id: catProfileId },
      });
      fostering = await queryRunner.manager.save(fostering);
      await this.createParticipantRelationship(fostering.id, userId);
      await this.createCatProfileRelationship(fostering.id, catProfileId);
      await queryRunner.commitTransaction();
      return fostering;
    } catch (err) {
      this.logger.error(err);
      await queryRunner.rollbackTransaction();
      if (fostering.id) {
        await this.deleteParticipantRelationship(fostering.id, userId);
        await this.deleteCatProfileRelationship(fostering.id, catProfileId);
      }
      throw new HttpException(
        'Failed to request fostering',
        HttpStatus.BAD_REQUEST
      );
    } finally {
      await queryRunner.release();
    }
  }

  async approve(id: string) {
    const fostering = await this.findById(id);
    return this.fosteringRepository.save({
      ...fostering,
      status: FosteringStatus.APPROVED,
    });
  }

  async reject(id: string): Promise<{ id: string }> {
    const fostering = await this.findById(id);
    return this.fosteringRepository.save({
      ...fostering,
      status: FosteringStatus.REJECTED,
    });
  }
}
