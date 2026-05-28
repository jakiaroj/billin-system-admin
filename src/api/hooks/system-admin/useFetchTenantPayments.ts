import { useQuery } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { TenantPaymentsResponse } from "@/types/system-admin";

const fetchTenantPayments = async (
  tenantId: number,
  api: AxiosInstance
): Promise<TenantPaymentsResponse> => {
  const result = await api.get(`/tenants/${tenantId}/payments`);
  return result.data;
};

const useFetchTenantPayments = (tenantId: number) => {
  const api = useCreateSystemAdminApi();
  return useQuery({
    queryKey: ["tenant-payments", tenantId],
    queryFn: () => fetchTenantPayments(tenantId, api),
    retry: 0,
  });
};

export default useFetchTenantPayments;
