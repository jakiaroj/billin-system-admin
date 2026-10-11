import { useMutation } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { RebuildPermissionsResponse } from "@/types/system-admin";

const rebuildTenantPermissions = async (
  tenantId: number,
  api: AxiosInstance
): Promise<RebuildPermissionsResponse> => {
  const result = await api.post(`/tenants/${tenantId}/rebuild-permissions`);
  return result.data;
};

const useRebuildTenantPermissions = () => {
  const api = useCreateSystemAdminApi();
  return useMutation({
    mutationFn: (tenantId: number) => rebuildTenantPermissions(tenantId, api),
  });
};

export default useRebuildTenantPermissions;
