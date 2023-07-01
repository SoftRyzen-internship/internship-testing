import { ApiProperty } from '@nestjs/swagger';

export class RegularExpressionResponseDto {
  @ApiProperty({
    example:
      '/^((ftp|http|https)://)?(www.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9-]*.?)*.{1}[A-Za-zА-Яа-я0-9-]{2,8}(/([w#!:.?+=&%@!-/])*)?/',
    description: 'Regular expression for link: resume, linkedin, ...',
  })
  public linkRegex: string;

  @ApiProperty({
    example: '/^t.me/w+$/',
    description: 'Regular expression for telegram',
  })
  public telegramRegex: string;

  @ApiProperty({
    example: '/^+[1-9]d{0,3}-d{1,14}$/i',
    description: 'Regular expression for phone',
  })
  public phoneRegex: string;

  @ApiProperty({
    example: '/^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{6,}$/',
    description: 'Regular expression for password',
  })
  public passwordRegex: string;

  @ApiProperty({
    example: '/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$/',
    description: 'Regular expression for email',
  })
  public emailRegex: string;
}
