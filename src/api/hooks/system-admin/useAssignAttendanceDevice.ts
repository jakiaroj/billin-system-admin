import { useMutation, useQueryClient } from "@tanstack/react-query";
import useCreateSystemAdminApi from "@/api/useCreateSystemAdminApi";
import { AxiosInstance } from "axios";
import {
  AssignAttendanceDeviceRequest,
  AttendanceDeviceResponse,
} from "@/types/system-admin";

const assignAttendanceDevice = async (
  data: AssignAttendanceDeviceRequest,
  api: AxiosInstance
): Promise<AttendanceDeviceResponse> => {
  const { deviceId, ...body } = data;
  const result = await api.post(`/attendance-devices/${deviceId}/assign`, body);
  return result.data;
};

const useAssignAttendanceDevice = () => {
  const api = useCreateSystemAdminApi();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignAttendanceDeviceRequest) =>
      assignAttendanceDevice(data, api),
    // A 500 can still mean "assigned but resync not queued", so refresh either way.
    onSettled: () => {
      client.invalidateQueries({ queryKey: ["attendance-devices"] });
    },
  });
};

export default useAssignAttendanceDevice;
