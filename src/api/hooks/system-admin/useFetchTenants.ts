import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { TenantsResponse } from "@/types/system-admin";

interface FetchTenantsParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

const fetchTenants = async (
  params: FetchTenantsParams,
  api: AxiosInstance
): Promise<TenantsResponse> => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.perPage) queryParams.append("perPage", params.perPage.toString());
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortDirection) queryParams.append("sortDirection", params.sortDirection);
  const result = await api.get(`/tenants?${queryParams.toString()}`);
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
