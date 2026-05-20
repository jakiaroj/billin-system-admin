import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { TenantsResponse, TenantFilters } from "@/types/system-admin";

interface FetchTenantsParams extends TenantFilters {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

const fetchTenants = async (
  params: FetchTenantsParams,
  api: AxiosInstance
): Promise<TenantsResponse> => {
  const q = new URLSearchParams();
  if (params.page) q.append("page", params.page.toString());
  if (params.perPage) q.append("perPage", params.perPage.toString());
  if (params.sortBy) q.append("sortBy", params.sortBy);
  if (params.sortDirection) q.append("sortDirection", params.sortDirection);
  if (params.business_name) q.append("business_name", params.business_name);
  if (params.industry) q.append("industry", params.industry);
  if (params.schema_name) q.append("schema_name", params.schema_name);
  if (params.domain_url) q.append("domain_url", params.domain_url);
  if (params.vat_no) q.append("vat_no", params.vat_no);
  if (params.status) q.append("status", params.status);
  if (params.public_user_id) q.append("public_user_id", params.public_user_id.toString());
  if (params.is_ird_certified !== undefined) q.append("is_ird_certified", String(params.is_ird_certified));
  if (params.is_cbms_enabled !== undefined) q.append("is_cbms_enabled", String(params.is_cbms_enabled));
  const result = await api.get(`/tenants?${q.toString()}`);
  return result.data;
};

const useFetchTenants = (params: FetchTenantsParams = {}) => {
  const api = useCreateSystemAdminApi();
  return useQuery({
    queryKey: ["tenants", params],
    queryFn: () => fetchTenants(params, api),
    placeholderData: keepPreviousData,
    retry: 0,
  });
};

export default useFetchTenants;
