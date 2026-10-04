import { IsString, IsOptional } from 'class-validator';

export class ForwardLeadDto {
  @IsString()
  partnerId: string;

  @IsString()
  @IsOptional()
  partnerWebhookUrl?: string;

  @IsString()
  @IsOptional()
  partnerEmail?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
