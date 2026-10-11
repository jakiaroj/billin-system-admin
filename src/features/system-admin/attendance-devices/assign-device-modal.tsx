"use client";

import { useState } from "react";
import { Button, Input } from "rizzui";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import { AxiosError } from "axios";
import useAssignAttendanceDevice from "@/api/hooks/system-admin/useAssignAttendanceDevice";
import useFetchTenants from "@/api/hooks/system-admin/useFetchTenants";
import ModalWrapper from "@/components/Modal/ModalWrapper";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import { errorHandler } from "@/utils/errorHandler";
import toast from "react-hot-toast";
import { AttendanceDevice } from "@/types/system-admin";

const SELECT_CLASS =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

interface AssignDeviceModalProps {
  device: AttendanceDevice;
}

export default NiceModal.create<AssignDeviceModalProps>(
  ({ device }: AssignDeviceModalProps) => {
    const modal = useModal();
    const assignMutation = useAssignAttendanceDevice();
    const { data: tenantsData, isLoading: tenantsLoading } = useFetchTenants();
    const tenants = tenantsData?.tenants ?? [];

    const [tenantId, setTenantId] = useState<string>("");
    const [name, setName] = useState<string>(device.name ?? "");
    const [tenantError, setTenantError] = useState<string>("");

    const isMove = device.status === "ACTIVE" && device.tenant_id !== null;

    const handleClose = () => {
      modal.hide();
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!tenantId) {
        setTenantError("Tenant is required");
        return;
      }
      setTenantError("");
      const trimmedName = name.trim();
      assignMutation.mutate(
        {
          deviceId: device.id,
          tenant_id: Number(tenantId),
          // Leaving name out keeps the device's current name.
          name: trimmedName && trimmedName !== device.name ? trimmedName : undefined,
        },
        {
          onSuccess: () => {
            toast.success(
              "Device assigned. It will now upload its people and scan history (about 15 minutes for a large history)."
            );
            handleClose();
          },
          onError: (error) => {
            const status = error instanceof AxiosError ? error.response?.status : undefined;
            if (status === 500) {
              toast.error(
                "Device assigned, but the history pull could not be queued. Use Re-pull on the device.",
                { duration: 8000 }
              );
              handleClose();
              return;
            }
            errorHandler(error);
          },
        }
      );
    };

    return (
      <>
        <LoadingOverlay isVisible={assignMutation.isPending} />
        <ModalWrapper
          isOpen={modal.visible}
          onClose={handleClose}
          title={`Assign Device — ${device.serial_no}`}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {isMove && (
              <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
                This device currently belongs to <strong>{device.tenant_name}</strong>.
                Assigning it to another tenant moves it: new scans go to the new tenant,
                and data already sent stays with {device.tenant_name}.
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Tenant <span className="text-red-500">*</span>
              </label>
              {tenantsLoading ? (
                <p className="text-sm text-gray-400">Loading tenants...</p>
              ) : (
                <select
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="" disabled>
                    Select a tenant
                  </option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.business_name} ({t.schema_name})
                      {t.id === device.tenant_id ? " — current" : ""}
                    </option>
                  ))}
                </select>
              )}
              {tenantError && <p className="text-xs text-red-500">{tenantError}</p>}
            </div>

            <Input
              label="Device Name"
              placeholder="e.g. Front desk"
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="Optional. Leave unchanged to keep the current name."
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={assignMutation.isPending}
                disabled={tenantsLoading}
              >
                Assign Device
              </Button>
            </div>
          </form>
        </ModalWrapper>
      </>
    );
  }
);
