import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";

interface SaveIrdConfigRequest {
  tenantId: number;
  is_ird_certified: boolean;
  cbms_username: string;
  cbms_password: string;
  is_realtime: boolean;
}

const saveIrdConfig = async (
  data: SaveIrdConfigRequest,
  api: AxiosInstance
): Promise<void> => {
  const { tenantId, ...body } = data;
  await api.post(`/tenants/${tenantId}/ird-config`, body);
};

const useSaveIrdConfig = () => {
  const api = useCreateSystemAdminApi();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: SaveIrdConfigRequest) => saveIrdConfig(data, api),
    onSuccess: (_, variables) => {
      client.invalidateQueries({ queryKey: ["tenant-ird-config", variables.tenantId] });
    },
  });
};

export default useSaveIrdConfig;
