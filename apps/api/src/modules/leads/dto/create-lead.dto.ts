import { Type } from 'class-transformer';
import { IsString, IsOptional, IsEnum, IsNumber, IsObject, ValidateNested, IsBoolean } from 'class-validator';

export enum ProjectType {
  SOLAR = 'solar',
  WAERMEPUMPE = 'waermepumpe',
  TREPPENLIFT = 'treppenlift',
  STROM = 'strom',
  GAS = 'gas',
  PFLEGEBOX = 'pflegebox'
}

export class ConsentDto {
  @IsBoolean()
  given: boolean;

  @IsString()
  timestamp: string;

  @IsString()
  sourceUrl: string;

  @IsString()
  ip: string;

  @IsString()
  textVersion: string;

  @IsString({ each: true })
  namedPartners: string[];
}

export class CreateLeadDto {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  product?: string;

  @IsEnum(ProjectType)
  @IsOptional()
  projectType?: ProjectType;

  @IsString()
  @IsOptional()
  source?: string;

  @IsNumber()
  @IsOptional()
  priority?: number = 0;

  @IsString()
  @IsOptional()
  campaignName?: string;

  @IsObject()
  @IsOptional()
  extraData?: Record<string, any>;

  @ValidateNested()
  @Type(() => ConsentDto)
  consent: ConsentDto;
}
