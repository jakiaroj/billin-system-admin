import { useQuery } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { IrdConfigResponse } from "@/types/system-admin";

const fetchIrdConfig = async (
  tenantId: number,
  api: AxiosInstance
): Promise<IrdConfigResponse> => {
  const result = await api.get(`/tenants/${tenantId}/ird-config`);
  return result.data;
};

const useFetchIrdConfig = (tenantId: number) => {
  const api = useCreateSystemAdminApi();
  return useQuery({
    queryKey: ["tenant-ird-config", tenantId],
    queryFn: () => fetchIrdConfig(tenantId, api),
    retry: 0,
  });
};

export default useFetchIrdConfig;
