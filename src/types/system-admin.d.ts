export interface SystemAdmin {
  id: number;
  name: string;
  email: string;
  mobile_no: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SystemAdminLoginResponse {
  state?: boolean;
  status: "SUCCESS" | "success" | "error" | "FAILED";
  message: string;
  access_token?: string;
  system_admin?: SystemAdmin;
  errors?: { [key: string]: string[] };
}

export interface SystemAdminLoginData {
  mobile_no: string;
  password: string;
}

export interface Tenant {
  id: number;
  business_name: string;
  domainUrl: string;
  industry: string;
  schema_name: string;
  status: string;
  public_user_id: number;
  latest_payment: unknown | null;
  subscription: unknown | null;
  trial_starts_at: string | null;
  trial_starts_at_bs?: string;
  trial_ends_at: string | null;
  trial_ends_at_bs?: string;
}

export interface TenantsResponse {
  status: "success" | "error" | "FAILED";
  message?: string;
  tenants?: Tenant[];
  details?: string;
  error?: string;
  errors?: { [key: string]: string[] };
}

export interface CreateTenantRequest {
  schema: string;
  businessName: string;
  industry: string;
  public_user_id?: number;
}

export interface SeedTenantsResponse {
  status: "success" | "error";
  message: string;
  tenants?: Tenant[];
}

export interface SeedSystemAdminResponse {
  status: "success" | "error";
  message: string;
}
