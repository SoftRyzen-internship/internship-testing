import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'Peter', description: 'User name' })
  username: string;

  @ApiProperty({
    example: 'BackEnd',
    description: 'Choosing the direction of the internship',
  })
  fieldOfInternship: string;

  @ApiProperty({
    example: '4',
    description: 'The name of the internship stream',
  })
  nameInternshipStream: string;
}
