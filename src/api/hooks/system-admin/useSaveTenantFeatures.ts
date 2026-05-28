import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";

interface SaveFeaturesRequest {
  tenantId: number;
  feature_ids: number[];
}

const saveTenantFeatures = async (
  data: SaveFeaturesRequest,
  api: AxiosInstance
): Promise<void> => {
  await api.post(`/tenants/${data.tenantId}/features`, {
    feature_ids: data.feature_ids,
  });
};

const useSaveTenantFeatures = () => {
  const api = useCreateSystemAdminApi();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: SaveFeaturesRequest) => saveTenantFeatures(data, api),
    onSuccess: (_, variables) => {
      client.invalidateQueries({ queryKey: ["tenant-features", variables.tenantId] });
    },
  });
};

export default useSaveTenantFeatures;
