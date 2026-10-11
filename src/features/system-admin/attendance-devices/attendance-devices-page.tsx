"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@ebay/nice-modal-react";
import { Badge, Button } from "rizzui";
import { differenceInSeconds, formatDistanceToNow } from "date-fns";
import {
  PiArrowLeft,
  PiArrowsClockwise,
  PiLinkSimple,
  PiProhibit,
  PiInfo,
} from "react-icons/pi";
import toast from "react-hot-toast";
import useFetchAttendanceDevices from "@/api/hooks/system-admin/useFetchAttendanceDevices";
import useDisableAttendanceDevice from "@/api/hooks/system-admin/useDisableAttendanceDevice";
import useResyncAttendanceDevice from "@/api/hooks/system-admin/useResyncAttendanceDevice";
import ActionModal from "@/components/Modal/ActionModal";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import { errorHandler } from "@/utils/errorHandler";
import {
  AttendanceDevice,
  AttendanceDeviceStatus,
  AttendanceDeviceSync,
  AttendanceDeviceSyncCount,
} from "@/types/system-admin";
import AssignDeviceModal from "./assign-device-modal";

const ONLINE_WINDOW_SECONDS = 2 * 60;

// Server sends "YYYY-MM-DD HH:mm:ss"; parse as local time.
function parseServerDate(value: string | null) {
  if (!value) return null;
  const d = new Date(value.replace(" ", "T"));
  return isNaN(d.getTime()) ? null : d;
}

function isOnline(lastSeenAt: string | null) {
  const d = parseServerDate(lastSeenAt);
  if (!d) return false;
  return differenceInSeconds(new Date(), d) <= ONLINE_WINDOW_SECONDS;
}

function StatusBadge({ status }: { status: AttendanceDeviceStatus }) {
  const color =
    status === "ACTIVE" ? "success" : status === "PENDING" ? "warning" : "danger";
  return (
    <Badge color={color} variant="flat" className="whitespace-nowrap capitalize">
      {status.toLowerCase()}
    </Badge>
  );
}

function LastSeen({ value }: { value: string | null }) {
  const d = parseServerDate(value);
  const online = isOnline(value);
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full ${
          online ? "bg-green-500" : "bg-gray-300"
        }`}
        title={online ? "Online" : "Offline"}
      />
      <div className="flex flex-col">
        <span className="text-xs text-gray-700">{online ? "Online" : "Offline"}</span>
        <span className="text-xs text-gray-400">
          {d ? `${formatDistanceToNow(d)} ago` : "Never"}
        </span>
      </div>
    </div>
  );
}

function SyncCount({ label, count }: { label: string; count: AttendanceDeviceSyncCount }) {
  return (
    <span className="whitespace-nowrap text-xs text-gray-600">
      <span className="text-gray-400">{label} </span>
      {count.stored.toLocaleString()}
      {count.on_device !== null && (
        <span className="text-gray-400"> / {count.on_device.toLocaleString()}</span>
      )}
    </span>
  );
}

function SyncStatus({ sync }: { sync?: AttendanceDeviceSync }) {
  if (!sync) return <span className="text-gray-400">—</span>;
  if (sync.state === "NOT_ASSIGNED") {
    return <span className="text-xs text-gray-400">Not assigned</span>;
  }

  const syncing = sync.state === "SYNCING";
  const lastUpload = parseServerDate(sync.last_upload_at);

  return (
    <div className="flex min-w-[180px] flex-col gap-1">
      <div className="flex items-center gap-2">
        <Badge
          color={syncing ? "info" : sync.state === "DISABLED" ? "danger" : "secondary"}
          variant="flat"
          className="whitespace-nowrap capitalize"
        >
          {sync.state.toLowerCase()}
        </Badge>
        {sync.percent !== null && (
          <span className="text-xs font-medium text-gray-700">{sync.percent}%</span>
        )}
      </div>
      {sync.percent !== null && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-full rounded-full ${syncing ? "bg-blue-500" : "bg-green-500"}`}
            style={{ width: `${Math.min(100, Math.max(0, sync.percent))}%` }}
          />
        </div>
      )}
      <div className="flex flex-wrap gap-x-3">
        <SyncCount label="People" count={sync.people} />
        <SyncCount label="Fingers" count={sync.fingerprints} />
        <SyncCount label="Scans" count={sync.scans} />
      </div>
      <span className="text-xs text-gray-400">
        {lastUpload ? `Last upload ${formatDistanceToNow(lastUpload)} ago` : "No uploads yet"}
      </span>
    </div>
  );
}

export default function AttendanceDevicesPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useFetchAttendanceDevices();
  const disableMutation = useDisableAttendanceDevice();
  const resyncMutation = useResyncAttendanceDevice();
  const actionModal = useModal(ActionModal);
  const assignModal = useModal(AssignDeviceModal);
  // Re-pull makes the device replay everything, so only allow it once per device per session.
  const [resyncedIds, setResyncedIds] = useState<Set<number>>(new Set());

  const devices = data?.data ?? [];

  const handleDisable = (device: AttendanceDevice) => {
    actionModal.show({
      title: "Disable Device",
      text: `Scans from ${device.name || device.serial_no} will stop counting until it is assigned again. The device keeps its data and retries, so nothing is lost.`,
      icon: <PiProhibit size={24} className="text-red-500" />,
      deleteButtonText: "Disable",
      isLoading: disableMutation.isPending,
      handleAction: () => {
        disableMutation.mutate(device.id, {
          onSuccess: () => toast.success("Device disabled"),
          onError: (error) => errorHandler(error),
        });
      },
    });
  };

  const handleResync = (device: AttendanceDevice) => {
    actionModal.show({
      title: "Re-pull Device Data",
      text: "The device will upload all its people and scan history again. This can take about 15 minutes for a large history. Duplicates are ignored. Only do this once.",
      isPrimary: true,
      icon: <PiArrowsClockwise size={24} className="text-blue-500" />,
      deleteButtonText: "Re-pull",
      isLoading: resyncMutation.isPending,
      handleAction: () => {
        setResyncedIds((prev) => new Set(prev).add(device.id));
        resyncMutation.mutate(device.id, {
          onSuccess: () =>
            toast.success("Re-pull requested. The device will upload its data over the next few minutes."),
          onError: (error) => {
            setResyncedIds((prev) => {
              const next = new Set(prev);
              next.delete(device.id);
              return next;
            });
            errorHandler(error);
          },
        });
      },
    });
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-6">
      <LoadingOverlay isVisible={disableMutation.isPending || resyncMutation.isPending} />

      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-1.5"
        >
          <PiArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Devices{" "}
            <span className="text-sm font-normal text-gray-400">({devices.length})</span>
          </h1>
          <p className="text-sm text-gray-600">
            Fingerprint devices that have contacted the server. A new device appears as
            Pending within about a minute of being plugged in.
          </p>
        </div>

        <div className="mb-6 flex gap-2 rounded-md border border-blue-100 bg-blue-50 p-3 text-xs text-blue-900">
          <PiInfo className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <div className="space-y-1">
            <p>
              Before assigning a device, turn on <strong>subscription attendance</strong> in the
              tenant&apos;s Features tab and run <strong>Rebuild Permissions</strong> for that tenant.
            </p>
            <p>
              Device not showing up? At most 20 unknown devices can register in 24 hours, and the
              device must reach the API over plain HTTP (port 80) at <code>/iclock/</code>.
            </p>
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading devices...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Failed to load devices.</p>
        ) : devices.length === 0 ? (
          <p className="text-center text-gray-500">No devices have contacted the server yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Device</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Status</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Tenant</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Sync</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Last Seen</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Last IP</th>
                  <th className="pb-3 pr-4 font-semibold text-gray-700">Assigned</th>
                  <th className="pb-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-900">{device.name || "—"}</p>
                      <p className="font-mono text-xs text-gray-400">{device.serial_no}</p>
                      {device.sync?.firmware && (
                        <p className="text-xs text-gray-400">{device.sync.firmware}</p>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={device.status} />
                    </td>
                    <td className="py-3 pr-4">
                      {device.tenant_id ? (
                        <button
                          type="button"
                          onClick={() => router.push(`/dashboard/tenants/${device.tenant_id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          {device.tenant_name || `#${device.tenant_id}`}
                        </button>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <SyncStatus sync={device.sync} />
                    </td>
                    <td className="py-3 pr-4">
                      <LastSeen value={device.last_seen_at} />
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-600">
                      {device.last_ip || "—"}
                    </td>
                    <td className="py-3 pr-4 text-xs text-gray-600">
                      {device.assigned_at ?? "—"}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => assignModal.show({ device })}
                          className="flex items-center gap-1.5"
                        >
                          <PiLinkSimple className="h-4 w-4" />
                          {device.status === "ACTIVE" ? "Move" : "Assign"}
                        </Button>
                        {device.status === "ACTIVE" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResync(device)}
                              disabled={resyncedIds.has(device.id)}
                              className="flex items-center gap-1.5"
                            >
                              <PiArrowsClockwise className="h-4 w-4" />
                              {resyncedIds.has(device.id) ? "Re-pull sent" : "Re-pull"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              color="danger"
                              onClick={() => handleDisable(device)}
                              className="flex items-center gap-1.5"
                            >
                              <PiProhibit className="h-4 w-4" />
                              Disable
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
