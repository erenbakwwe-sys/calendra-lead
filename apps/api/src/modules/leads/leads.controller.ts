import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ForwardLeadDto } from './dto/forward-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Leads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.createLead(user.tenantId, createLeadDto);
  }

  @Post(':id/forward')
  forward(@Param('id') id: string, @Body() forwardLeadDto: ForwardLeadDto) {
    return this.leadsService.forwardToPartner(id, forwardLeadDto);
  }

  @Get()
  findAll(@CurrentUser() user: any, @Query() filters: any) {
    return this.leadsService.findAll(user.tenantId, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('note') note?: string
  ) {
    return this.leadsService.updateStatus(id, status, user.id, note);
  }
}
