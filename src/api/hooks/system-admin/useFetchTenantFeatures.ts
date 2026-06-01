import { useQuery } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { TenantFeaturesResponse } from "@/types/system-admin";

const fetchTenantFeatures = async (
  tenantId: number,
  api: AxiosInstance
): Promise<TenantFeaturesResponse> => {
  const result = await api.get(`/tenants/${tenantId}/features`);
  return result.data;
};

const useFetchTenantFeatures = (tenantId: number) => {
  const api = useCreateSystemAdminApi();
  return useQuery({
    queryKey: ["tenant-features", tenantId],
    queryFn: () => fetchTenantFeatures(tenantId, api),
    retry: 0,
  });
};

export default useFetchTenantFeatures;
