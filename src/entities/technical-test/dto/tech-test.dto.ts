import { ApiProperty } from '@nestjs/swagger';
import * as regex from '@src/constants/regex-expressions';
import { IsArray, IsString, Matches } from 'class-validator';

export class CreateTechnicalTestDto {
  @ApiProperty({ example: 'Frontend', description: 'Direction' })
  public direction: string;

  @ApiProperty({
    example: 'Test task for <Direction>',
    description: 'Test task for <Direction>',
  })
  @IsString()
  public title: string;

  @ApiProperty({
    example: 'Implement functionality for a web application using React',
    description: 'Short description of test',
  })
  @IsString()
  public shortDescription: string;

  @ApiProperty({
    example: 'https://document.com',
    description: 'Materials for test',
  })
  @IsString()
  @Matches(regex.linkRegex, {
    message: 'This should have been a link',
  })
  public techDocumentationUrl: string;

  @ApiProperty({
    example: 'https://www.figma.com',
    description: 'Layout for test',
  })
  @IsString()
  @Matches(regex.linkRegex, {
    message: 'This should have been a link',
  })
  public techLayoutUrl: string;

  @ApiProperty({
    example: [
      'Layout fixed in px',
      'The layout is semantic and valid, accessibility will be a bonus (a11y)',
    ],
    description: 'Acceptance Criteria',
  })
  @IsArray()
  public acceptanceCriteria: string[];
}

export class ResponseCreateTechnicalTestDto extends CreateTechnicalTestDto {
  @ApiProperty({ example: 1, description: 'Questions block id' })
  id: number;

  @ApiProperty({
    example: '2023-06-17T11:48:47.135Z',
    description: 'Questions block createAt',
  })
  createAt: string;

  @ApiProperty({
    example: '2023-06-17T11:48:47.135Z',
    description: 'Questions block updateAt',
  })
  updateAt: string;

  @ApiProperty({ example: 1 })
  internshipStreamId: number;

  @ApiProperty({ example: '17.09.2023 12:00' })
  deadline: string;
}
