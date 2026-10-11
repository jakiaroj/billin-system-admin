import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { AttendanceDeviceResponse } from "@/types/system-admin";

const resyncAttendanceDevice = async (
  deviceId: number,
  api: AxiosInstance
): Promise<AttendanceDeviceResponse> => {
  const result = await api.post(`/attendance-devices/${deviceId}/resync`);
  return result.data;
};

const useResyncAttendanceDevice = () => {
  const api = useCreateSystemAdminApi();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: number) => resyncAttendanceDevice(deviceId, api),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["attendance-devices"] });
    },
  });
};

export default useResyncAttendanceDevice;
