import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, Matches } from 'class-validator';

import { EDifficulty } from '@src/enums/difficulty.enum';

import { LINK_REGEX } from '@src/constants/constants';

export class CreateResultTechnicalDto {
  @ApiProperty({
    example: 'https://livepage.com',
    description: 'Link to live page',
  })
  @IsString()
  @Matches(LINK_REGEX, {
    message: 'This should have been a link',
  })
  public livePageLink: string;

  @ApiProperty({
    example: 'https://repository.com',
    description: 'Link to repository',
  })
  @IsString()
  @Matches(LINK_REGEX, {
    message: 'This should have been a link',
  })
  public repositoryLink: string;

  @ApiProperty({ enum: EDifficulty, default: EDifficulty.EASY })
  public difficulty: EDifficulty;

  @ApiProperty({ example: 'Some comments', description: 'Comments' })
  @IsString()
  public comments: string;
}

export class UpdateResultTechnicalDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  public isPassedUserTechTest: boolean;
}

export class ResponseCreateResultTechnicalDto extends CreateResultTechnicalDto {
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
  userId: number;

  @ApiProperty({ example: false })
  isChecked: boolean;
}

export class ResponseUpdateResultTechnicalDto extends ResponseCreateResultTechnicalDto {
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

  @ApiProperty({ example: true })
  isChecked: boolean;
}
