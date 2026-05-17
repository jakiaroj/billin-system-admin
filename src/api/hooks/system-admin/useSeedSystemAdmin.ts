import { useMutation } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { SeedSystemAdminResponse } from "@/types/system-admin";

const seedSystemAdmin = async (api: AxiosInstance): Promise<SeedSystemAdminResponse> => {
  const result = await api.post("/tenants/seed-system-admin");
  return result.data;
};

const useSeedSystemAdmin = () => {
  const api = useCreateSystemAdminApi();
  return useMutation({
    mutationFn: () => seedSystemAdmin(api),
  });
};

export default useSeedSystemAdmin;
