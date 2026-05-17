import { useMutation } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { SystemAdminLoginResponse, SystemAdminLoginData } from "@/types/system-admin";

const systemAdminLogin = async (
  data: SystemAdminLoginData,
  api: AxiosInstance
): Promise<SystemAdminLoginResponse> => {
  const result = await api.post("/system-admin/login", data);
  return result.data;
};

const useSystemAdminLogin = () => {
  const api = useCreateSystemAdminApi();
  return useMutation({
    mutationFn: (data: SystemAdminLoginData) => systemAdminLogin(data, api),
  });
};

export default useSystemAdminLogin;
