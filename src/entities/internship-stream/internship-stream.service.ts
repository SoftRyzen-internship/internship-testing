import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import { InternshipStream } from './internship-stream.entity';

@Injectable()
export class InternshipStreamService {
  constructor(
    @InjectRepository(InternshipStream)
    private readonly internshipStreamRepository: Repository<InternshipStream>,
  ) {}

  // Create new stream
  public async createInternshipStream(adminId: number, body: CreateStreamDto) {
    const lastActiveStream = await this.internshipStreamRepository.findOne({
      where: { isActive: true },
    });
    if (lastActiveStream) {
      lastActiveStream.isActive = false;
      await this.internshipStreamRepository.save(lastActiveStream);
    }

    const newStream = this.internshipStreamRepository.create({
      internshipStreamName: body.internshipStreamName,
      directions: body.directions,
      owner: 'admin',
      ownerId: adminId,
      number: lastActiveStream ? lastActiveStream.number + 1 : 1,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    const createdStream = await this.internshipStreamRepository.save(newStream);
    return createdStream;
  }

  // Get active stream
  public async getActiveInternshipStream() {
    return await this.internshipStreamRepository.findOne({
      where: { isActive: true },
    });
  }

  public async getInternshipStreams(
    number?: number,
    isActive?: boolean,
    internshipStreamName?: string,
    startDate?: string,
  ) {
    const filters: Record<string, any> = {};

    if (number !== undefined) {
      filters.number = number;
    }
    if (isActive !== undefined) {
      filters.isActive = isActive;
    }
    if (internshipStreamName !== undefined) {
      filters.internshipStreamName = internshipStreamName;
    }
    if (startDate !== undefined) {
      filters.startDate = startDate;
    }

    return this.internshipStreamRepository.find({ where: filters });
  }

  public async updateInternshipStreamFields(
    id: number,
    fieldsToUpdate: Partial<UpdateStreamDto>,
  ): Promise<InternshipStream> {
    const stream = await this.internshipStreamRepository.findOne({
      where: { id },
    });
    if (!stream) {
      throw new NotFoundException('Internship stream not found');
    }

    Object.assign(stream, fieldsToUpdate);

    return this.internshipStreamRepository.save(stream);
  }
}
