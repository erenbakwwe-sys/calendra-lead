import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTenantDto {
  @ApiProperty({ example: 'Demo GmbH' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'demo', required: false })
  @IsString()
  @IsOptional()
  slug?: string;
}
