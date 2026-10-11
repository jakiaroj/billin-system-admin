import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import { AttendanceDeviceResponse } from "@/types/system-admin";

const disableAttendanceDevice = async (
  deviceId: number,
  api: AxiosInstance
): Promise<AttendanceDeviceResponse> => {
  const result = await api.post(`/attendance-devices/${deviceId}/disable`);
  return result.data;
};

const useDisableAttendanceDevice = () => {
  const api = useCreateSystemAdminApi();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (deviceId: number) => disableAttendanceDevice(deviceId, api),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["attendance-devices"] });
    },
  });
};

export default useDisableAttendanceDevice;
