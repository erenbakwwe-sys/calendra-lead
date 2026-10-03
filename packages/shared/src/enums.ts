export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  TEAM_LEADER = 'team_leader',
  QC = 'qc',
  AGENT = 'agent',
  CALLCENTER = 'callcenter',
  PROVIDER = 'provider',
}

export enum LeadStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in_progress',
  CALLBACK = 'callback',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  QC_PENDING = 'qc_pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELIVERED = 'delivered',
  NOT_REACHABLE = 'not_reachable',
  WRONG_NUMBER = 'wrong_number',
  DO_NOT_CALL = 'do_not_call',
  REJECTED_NO_CONSENT = 'rejected_no_consent',
  DUPLICATE = 'duplicate',
}

export enum DialerMode {
  MANUAL = 'manual',
  PREVIEW = 'preview',
  POWER = 'power',
  PREDICTIVE = 'predictive',
}

export enum AssignmentMode {
  MANUAL = 'manual',
  ROUND_ROBIN = 'round_robin',
  LOAD_BASED = 'load_based',
  POOL = 'pool',
}

export enum AgentStatus {
  OFFLINE = 'offline',
  AVAILABLE = 'available',
  ON_CALL = 'on_call',
  WRAP_UP = 'wrap_up',
  PAUSE = 'pause',
}
