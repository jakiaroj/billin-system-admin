import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { TenantsResponse, CreateTenantRequest } from "@/types/system-admin";

const createTenant = async (
  data: CreateTenantRequest,
  api: AxiosInstance
): Promise<TenantsResponse> => {
  const result = await api.post("/tenants/createTenant", data);
  return result.data;
};

const useCreateTenant = () => {
  const api = useCreateSystemAdminApi();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTenantRequest) => createTenant(data, api),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export default useCreateTenant;
