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

export interface Plan {
  id: number;
  name: string;
  price_cents: number;
  interval: "monthly" | "yearly" | "3yearly" | "5yearly";
  status: string;
}

export interface TenantSubscription {
  id: number;
  tenant_id: number;
  plan_id: number;
  plan: Plan;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

export interface TenantPayment {
  id: number;
  tenant_id: number;
  plan_id: number;
  amount_cents: number;
  status: string;
  payment_type: string;
  admin_id: number | null;
  transaction_id: string | null;
  billing_reason: string;
  paid_at: string | null;
  created_at: string;
}

export interface PlansResponse {
  state: boolean;
  status: string;
  data: Plan[];
}

export interface AdminSubscribeRequest {
  tenantId: number;
  plan_id: number;
  amount_cents?: number;
  transaction_id?: string;
  is_ird_certified?: boolean;
  is_cbms_enabled?: boolean;
}

export interface AdminSubscribeResponse {
  state: boolean;
  status: string;
  message: string;
  tenant_status: string;
  subscription: TenantSubscription;
  payment: TenantPayment;
}

export interface PublicUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_no: string;
  phone_verified_at: string | null;
  status: boolean;
  avatar: string | null;
  gender: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantFilters {
  business_name?: string;
  industry?: string;
  schema_name?: string;
  domain_url?: string;
  vat_no?: string;
  status?: string;
  public_user_id?: number;
  is_ird_certified?: boolean;
  is_cbms_enabled?: boolean;
}

export interface Tenant {
  id: number;
  business_name: string;
  domainUrl: string;
  industry: string;
  schema_name: string;
  status: string;
  public_user_id: number;
  public_user?: PublicUser;
  address?: string;
  logo?: string | null;
  vat_no?: string | null;
  is_cbms_enabled: boolean;
  is_ird_certified: boolean;
  latest_payment: TenantPayment | null;
  subscription: TenantSubscription | null;
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

export interface TenantDetailPlan {
  id: number;
  name: string;
  interval: string;
  features: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
}

export interface TenantDetailSubscription {
  id: number;
  tenant_id: number;
  plan_id: number;
  plan: TenantDetailPlan;
  status: string;
  current_period_start: string;
  current_period_end: string;
  canceled_at: string | null;
  created_at: string;
}

export interface TenantDetail {
  id: number;
  business_name: string;
  industry: string;
  domain_url: string;
  schema_name: string;
  status: string;
  trial_starts_at: string | null;
  trial_ends_at: string | null;
  vat_no: string | null;
  address: string | null;
  logo: string | null;
  subscription: TenantDetailSubscription | null;
}

export interface TenantDetailResponse {
  state: boolean;
  status: string;
  data: TenantDetail;
}

export interface TenantPaymentDetail {
  id: number;
  tenant_id: number;
  subscription_id: number | null;
  plan_id: number | null;
  amount_cents: number;
  status: string;
  transaction_id: string | null;
  billing_reason: string;
  payment_type: string;
  admin_id: number | null;
  paid_at: string | null;
  created_at: string;
  is_active_subscription: boolean;
}

export interface TenantPaymentsResponse {
  state: boolean;
  status: string;
  data: TenantPaymentDetail[];
}

export interface IrdCredential {
  id: number;
  tenant_id: number;
  cbms_username: string;
  cbms_password: string;
  status: string;
  realtime: boolean;
  created_at: string;
  updated_at: string;
}

export interface IrdConfigData {
  is_ird_certified: boolean;
  ird_credential: IrdCredential | null;
}

export interface IrdConfigResponse {
  state: boolean;
  status: string;
  data: IrdConfigData;
}

export interface TenantFeature {
  id: number;
  feature: string;
  enabled: boolean;
}

export interface TenantFeaturesResponse {
  state: boolean;
  status: string;
  features: TenantFeature[];
}

export type AttendanceDeviceStatus = "PENDING" | "ACTIVE" | "DISABLED";

export type AttendanceDeviceSyncState = "SYNCING" | "IDLE" | "DISABLED" | "NOT_ASSIGNED";

export interface AttendanceDeviceSyncCount {
  stored: number;
  // null until the device reports its own totals (some firmware never does)
  on_device: number | null;
}

export interface AttendanceDeviceSync {
  state: AttendanceDeviceSyncState;
  percent: number | null;
  people: AttendanceDeviceSyncCount;
  fingerprints: AttendanceDeviceSyncCount;
  scans: AttendanceDeviceSyncCount;
  last_upload_at: string | null;
  firmware: string | null;
  reported_at: string | null;
}

export interface AttendanceDevice {
  id: number;
  serial_no: string;
  tenant_id: number | null;
  tenant_name: string;
  name: string | null;
  status: AttendanceDeviceStatus;
  last_ip: string | null;
  last_seen_at: string | null;
  last_seen_at_bs?: string | null;
  assigned_at: string | null;
  assigned_at_bs?: string | null;
  created_at: string;
  created_at_bs?: string;
  updated_at: string;
  updated_at_bs?: string;
  sync?: AttendanceDeviceSync;
}

export interface AttendanceDevicesResponse {
  state: boolean;
  status: string;
  message?: string;
  data: AttendanceDevice[];
}

export interface AttendanceDeviceResponse {
  state: boolean;
  status: string;
  message?: string;
  data: AttendanceDevice;
}

export interface AssignAttendanceDeviceRequest {
  deviceId: number;
  tenant_id: number;
  name?: string;
}

export interface RebuildPermissionsResponse {
  state: boolean;
  status: string;
  message?: string;
}
