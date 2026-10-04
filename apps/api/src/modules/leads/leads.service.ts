import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { ForwardLeadDto } from './dto/forward-lead.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(private prisma: PrismaService) {}

  private normalizePhoneNumber(phone: string): string {
    let normalized = phone.replace(/[^0-9+]/g, '');
    if (normalized.startsWith('00')) {
      normalized = '+' + normalized.substring(2);
    } else if (normalized.startsWith('0')) {
      normalized = '+49' + normalized.substring(1);
    }
    return normalized;
  }

  async createLead(tenantId: string, dto: CreateLeadDto) {
    const { consent, extraData, street, projectType, ...leadData } = dto;
    const phoneNormalized = this.normalizePhoneNumber(leadData.phone);
    const combinedExtraData = {
      ...((extraData as any) || {}),
      ...(street ? { street } : {}),
      ...(projectType ? { projectType } : {}),
    };

    const createdLead = await this.prisma.lead.create({
      data: {
        ...leadData,
        phoneNormalized,
        tenantId,
        extraData: combinedExtraData,
        consents: {
          create: {
            consentGiven: consent.given,
            consentTimestamp: new Date(consent.timestamp),
            consentSourceUrl: consent.sourceUrl,
            consentIp: consent.ip,
            consentTextVersion: consent.textVersion,
            namedPartners: consent.namedPartners,
          },
        },
      },
      include: {
        consents: true,
      },
    });

    return createdLead;
  }

  async forwardToPartner(leadId: string, dto: ForwardLeadDto) {
    try {
      const lead = await this.prisma.lead.findUnique({
        where: { id: leadId },
        include: { consents: true },
      });

      if (!lead) {
        throw new Error(`Lead with ID ${leadId} not found`);
      }

      // Determine webhook destination
      let targetUrl = dto.partnerWebhookUrl || process.env.DEFAULT_PARTNER_WEBHOOK_URL;
      
      if (!targetUrl) {
        const activeProvider = await this.prisma.provider.findFirst({
          where: { isActive: true },
        });
        if (activeProvider && activeProvider.pullConfig && (activeProvider.pullConfig as any).webhookUrl) {
          targetUrl = (activeProvider.pullConfig as any).webhookUrl;
        }
      }

      // If webhook destination is set, dispatch payload
      if (targetUrl) {
        try {
          await fetch(targetUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'VertriebsHub-Partner-Bridge/1.0',
            },
            body: JSON.stringify({
              event: 'lead.forwarded',
              lead: {
                id: lead.id,
                firstName: lead.firstName,
                lastName: lead.lastName,
                phone: lead.phone,
                phoneNormalized: lead.phoneNormalized,
                email: lead.email,
                postalCode: lead.postalCode,
                city: lead.city,
                street: (lead.extraData as any)?.street || null,
                product: lead.product,
                projectType: (lead as any).projectType || lead.product,
                extraData: lead.extraData,
                consent: lead.consents?.[0] || null,
              },
              notes: dto.notes || 'Automatisch von VertriebsHub übermittelt',
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (fetchError) {
          this.logger.warn(`Webhook call to ${targetUrl} failed: ${fetchError.message}`);
        }
      }

      // Update lead status to assigned and record history
      await this.prisma.leadStatusHistory.create({
        data: {
          leadId,
          fromStatus: lead.status,
          toStatus: 'assigned',
          note: `Lead via API Schnittstelle an Vertriebspartner (${dto.partnerId}) übermittelt`,
        },
      });

      await this.prisma.lead.update({
        where: { id: leadId },
        data: { status: 'assigned' },
      });

      // Log audit trail
      await this.prisma.auditLog.create({
        data: {
          tenantId: lead.tenantId,
          action: 'LEAD_FORWARDED',
          entity: 'LEAD',
          entityId: leadId,
          newValue: {
            partnerId: dto.partnerId,
            targetUrl: targetUrl || 'Vertriebspartner API Standard',
            method: targetUrl ? 'WEBHOOK_PUSH' : 'INTERNAL_ROUTING',
            notes: dto.notes,
            forwardedAt: new Date().toISOString(),
          },
        },
      });

      return {
        success: true,
        leadId,
        forwardedTo: targetUrl || 'Vertriebspartner API',
        partnerId: dto.partnerId,
        deliveredAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Failed to forward lead ${leadId} to partner ${dto.partnerId}`, error.stack);
      return { success: false, error: error.message };
    }
  }

  async findAll(tenantId: string, filters: any = {}) {
    const { page = 1, limit = 10, ...where } = filters;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({
        where: { tenantId, ...where },
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count({ where: { tenantId, ...where } }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findOne(id: string) {
    return this.prisma.lead.findUnique({
      where: { id },
      include: { consents: true },
    });
  }

  async updateStatus(id: string, status: string, userId?: string, note?: string) {
    return this.prisma.lead.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}
