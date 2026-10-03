import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await argon2.hash(createUserDto.password);
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });
  }

  findAll(tenantId?: string) {
    const where = { deletedAt: null, ...(tenantId && { tenantId }) };
    return this.prisma.user.findMany({ where, select: { id: true, email: true, firstName: true, lastName: true, role: true, tenantId: true, isActive: true } });
  }

  async findOne(id: string, tenantId?: string) {
    const where: any = { id, deletedAt: null };
    if (tenantId) where.tenantId = tenantId;
    const user = await this.prisma.user.findFirst({ where, select: { id: true, email: true, firstName: true, lastName: true, role: true, tenantId: true, isActive: true } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, tenantId?: string) {
    await this.findOne(id, tenantId);
    const data: any = { ...updateUserDto };
    if (data.password) {
      data.password = await argon2.hash(data.password);
    }
    return this.prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, role: true, tenantId: true }
    });
  }

  async remove(id: string, tenantId?: string) {
    await this.findOne(id, tenantId);
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
