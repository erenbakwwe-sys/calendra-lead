export interface NormalizedLead {
  providerLeadId?: string;
  firstName: string;
  lastName?: string;
  phone: string;
  phoneNormalized: string;
  email?: string;
  postalCode?: string;
  city?: string;
  product?: string;
  source?: string;
  consent: LeadConsentData;
  extraData?: Record<string, unknown>;
}

export interface LeadConsentData {
  given: boolean;
  timestamp: string;
  sourceUrl?: string;
  sourceText?: string;
  ip?: string;
  textVersion?: string;
  namedPartners?: string[];
}

export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface JwtPayload {
  userId: string;
  tenantId: string;
  role: string;
  email: string;
}
