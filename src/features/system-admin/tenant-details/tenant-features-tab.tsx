"use client";

import { useState, useEffect } from "react";
import { useModal } from "@ebay/nice-modal-react";
import useFetchTenantFeatures from "@/api/hooks/system-admin/useFetchTenantFeatures";
import useSaveTenantFeatures from "@/api/hooks/system-admin/useSaveTenantFeatures";
import { TenantFeature } from "@/types/system-admin";
import { Button } from "rizzui";
import ActionModal from "@/components/Modal/ActionModal";
import { PiFloppyDisk } from "react-icons/pi";
import toast from "react-hot-toast";
import { errorHandler } from "@/utils/errorHandler";

interface TenantFeaturesTabProps {
  tenantId: number;
}

export default function TenantFeaturesTab({ tenantId }: TenantFeaturesTabProps) {
  const { data, isLoading, isError } = useFetchTenantFeatures(tenantId);
  const saveMutation = useSaveTenantFeatures();
  const actionModal = useModal(ActionModal);
  const [features, setFeatures] = useState<TenantFeature[]>([]);

  useEffect(() => {
    if (data?.features) {
      setFeatures(data.features);
    }
  }, [data]);

  const toggle = (id: number) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleSave = () => {
    actionModal.show({
      title: "Save Features",
      text: "Are you sure you want to update the features for this tenant?",
      isPrimary: true,
      icon: <PiFloppyDisk size={24} className="text-blue-500" />,
      deleteButtonText: "Save",
      isLoading: saveMutation.isPending,
      handleAction: () => {
        const enabledIds = features.filter((f) => f.enabled).map((f) => f.id);
        saveMutation.mutate(
          { tenantId, feature_ids: enabledIds },
          {
            onSuccess: () => {
              toast.success("Features saved successfully");
              actionModal.hide();
              window.location.reload();
            },
            onError: (error) => {
              errorHandler(error);
            },
          }
        );
      },
    });
  };

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading features...</p>;
  }

  if (isError || !data?.features) {
    return <p className="text-center text-red-500">Failed to load features.</p>;
  }

  if (features.length === 0) {
    return <p className="text-center text-gray-400">No features found.</p>;
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button
          onClick={handleSave}
          isLoading={saveMutation.isPending}
          className="flex items-center gap-2 px-6"
        >
          <PiFloppyDisk className="h-5 w-5" />
          Save Features
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.id}
            className={`rounded-lg border p-4 transition-colors ${
              f.enabled ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white"
            }`}
          >
            <p className="mb-3 font-medium capitalize text-gray-900">
              {f.feature.replace(/_/g, " ")}
            </p>
            <button
              type="button"
              onClick={() => toggle(f.id)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
                f.enabled ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                  f.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
