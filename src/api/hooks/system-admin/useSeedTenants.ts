import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { SeedTenantsResponse } from "@/types/system-admin";

const seedTenants = async (api: AxiosInstance): Promise<SeedTenantsResponse> => {
  const result = await api.get("/tenants/seed");
  return result.data;
};

const useSeedTenants = () => {
  const api = useCreateSystemAdminApi();
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => seedTenants(api),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export default useSeedTenants;
