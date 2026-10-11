import { useQuery } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { AttendanceDevicesResponse } from "@/types/system-admin";

const fetchAttendanceDevices = async (
  api: AxiosInstance
): Promise<AttendanceDevicesResponse> => {
  const result = await api.get("/attendance-devices");
  return result.data;
};

const useFetchAttendanceDevices = () => {
  const api = useCreateSystemAdminApi();
  return useQuery({
    queryKey: ["attendance-devices"],
    queryFn: () => fetchAttendanceDevices(api),
    // Devices check in every few seconds; poll so new PENDING devices, the online dot
    // and sync progress stay current. Poll faster while any device is uploading.
    refetchInterval: (query) =>
      query.state.data?.data?.some((d) => d.sync?.state === "SYNCING")
        ? 10 * 1000
        : 30 * 1000,
    staleTime: 0,
    retry: 0,
  });
};

export default useFetchAttendanceDevices;
