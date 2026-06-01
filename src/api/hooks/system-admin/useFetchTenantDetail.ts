import { useQuery } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { TenantDetailResponse } from "@/types/system-admin";

const fetchTenantDetail = async (
  tenantId: number,
  api: AxiosInstance
): Promise<TenantDetailResponse> => {
  const result = await api.get(`/tenants/${tenantId}`);
  return result.data;
};

const useFetchTenantDetail = (tenantId: number) => {
  const api = useCreateSystemAdminApi();
  return useQuery({
    queryKey: ["tenant-detail", tenantId],
    queryFn: () => fetchTenantDetail(tenantId, api),
    retry: 0,
  });
};

export default useFetchTenantDetail;
