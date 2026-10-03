import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');
  const hashedPassword = await argon2.hash('Admin123!');

  // 1. Tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo' },
    update: {},
    create: {
      name: 'Demo GmbH',
      slug: 'demo',
    },
  });
  console.log(`  ✅ Tenant: ${tenant.name} (${tenant.id})`);

  // 2. Call Center (find or create)
  let callCenter = await prisma.callCenter.findFirst({
    where: { tenantId: tenant.id, name: 'Berlin Call Center' },
  });
  if (!callCenter) {
    callCenter = await prisma.callCenter.create({
      data: {
        name: 'Berlin Call Center',
        tenantId: tenant.id,
      },
    });
  }
  console.log(`  ✅ Call Center: ${callCenter.name} (${callCenter.id})`);

  // 3. Team (find or create)
  let team = await prisma.team.findFirst({
    where: { callCenterId: callCenter.id, name: 'Team Alpha' },
  });
  if (!team) {
    team = await prisma.team.create({
      data: {
        name: 'Team Alpha',
        callCenterId: callCenter.id,
      },
    });
  }
  console.log(`  ✅ Team: ${team.name} (${team.id})`);

  // 4. Users
  const users = [
    { email: 'super@calendra.de', role: 'super_admin', firstName: 'Super', lastName: 'Admin' },
    { email: 'admin@demo.de', role: 'tenant_admin', firstName: 'Firma', lastName: 'Admin' },
    { email: 'teamlead@demo.de', role: 'team_leader', firstName: 'Ahmet', lastName: 'Yilmaz' },
    { email: 'agent1@demo.de', role: 'agent', firstName: 'Mehmet', lastName: 'Demir' },
    { email: 'agent2@demo.de', role: 'agent', firstName: 'Ayşe', lastName: 'Kaya' },
    { email: 'qc@demo.de', role: 'qc', firstName: 'Lisa', lastName: 'Müller' },
  ];

  for (const u of users) {
    const needsCallCenter = ['agent', 'team_leader'].includes(u.role);
    const user = await prisma.user.upsert({
      where: { email_tenantId: { email: u.email, tenantId: tenant.id } },
      update: {},
      create: {
        tenantId: tenant.id,
        email: u.email,
        password: hashedPassword,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        language: needsCallCenter ? 'tr' : 'de',
        callCenterId: needsCallCenter ? callCenter.id : undefined,
        teamId: needsCallCenter ? team.id : undefined,
      },
    });
    console.log(`  ✅ User: ${user.email} (${user.role})`);
  }

  // 5. Feature Flags
  const flags = [
    { key: 'predictive_dialer', value: false, description: 'Predictive Dialer (experimentell)' },
    { key: 'own_projects_mode', value: true, description: 'Eigene Projekte Modus' },
    { key: 'mask_phone_numbers', value: true, description: 'Telefonnummern in Listen maskieren' },
  ];

  for (const flag of flags) {
    await prisma.featureFlag.upsert({
      where: { tenantId_key: { tenantId: tenant.id, key: flag.key } },
      update: {},
      create: {
        tenantId: tenant.id,
        key: flag.key,
        value: flag.value,
        description: flag.description,
      },
    });
  }
  console.log('  ✅ Feature Flags created');

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📋 Login credentials:');
  console.log('  Super Admin: super@calendra.de / Admin123!');
  console.log('  Tenant Admin: admin@demo.de / Admin123!');
  console.log('  Team Leader: teamlead@demo.de / Admin123!');
  console.log('  Agent 1: agent1@demo.de / Admin123!');
  console.log('  Agent 2: agent2@demo.de / Admin123!');
  console.log('  QC: qc@demo.de / Admin123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
