import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { AdminSubscribeRequest, AdminSubscribeResponse } from "@/types/system-admin";

const adminSubscribe = async (
  data: AdminSubscribeRequest,
  api: AxiosInstance
): Promise<AdminSubscribeResponse> => {
  const { tenantId, ...body } = data;
  const result = await api.post(`/tenants/${tenantId}/admin-subscribe`, body);
  return result.data;
};

const useAdminSubscribe = () => {
  const api = useCreateSystemAdminApi();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminSubscribeRequest) => adminSubscribe(data, api),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["tenants"] });
    },
  });
};

export default useAdminSubscribe;
