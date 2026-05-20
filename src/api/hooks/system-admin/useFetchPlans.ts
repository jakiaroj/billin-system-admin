import { useQuery } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { PlansResponse } from "@/types/system-admin";

const fetchPlans = async (api: AxiosInstance): Promise<PlansResponse> => {
  const result = await api.get("/public/plans");
  return result.data;
};

const useFetchPlans = () => {
  const api = useCreateSystemAdminApi();
  return useQuery({
    queryKey: ["plans"],
    queryFn: () => fetchPlans(api),
    retry: 0,
  });
};

export default useFetchPlans;
