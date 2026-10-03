"use client";

import { LeadIntakeWizard } from '@/components/leads/LeadIntakeWizard';

export default function NewLeadPage() {
  return (
    <div className="py-2">
      <LeadIntakeWizard isOpen={true} />
    </div>
  );
}
