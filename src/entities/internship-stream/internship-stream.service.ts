import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStreamDto } from './dto/create-stream.dto';
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

  // Get all streams
  public async getInternshipStreams(
    number: number,
    internshipStreamName: string,
    direction: string,
    startDate: string,
  ) {
    const filter: any = {};
    if (number !== undefined) {
      filter.number = Number(number);
    }
    if (internshipStreamName !== undefined) {
      filter.internshipStreamName = internshipStreamName;
    }
    if (startDate !== undefined) {
      filter.startDate = startDate;
    }

    const streams = await this.internshipStreamRepository.find({
      where: filter,
      order: { number: 'DESC' },
    });
    return streams;
  }

  // update stream
  public async updateInternshipStreamFields(id: number, body: CreateStreamDto) {
    const stream = await this.internshipStreamRepository.findOne({
      where: { id },
    });
    if (!stream) {
      throw new NotFoundException('Internship stream not found');
    }

    Object.assign(stream, body);

    return await this.internshipStreamRepository.save(stream);
  }
}
