"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useModal } from "@ebay/nice-modal-react";
import useFetchIrdConfig from "@/api/hooks/system-admin/useFetchIrdConfig";
import useSaveIrdConfig from "@/api/hooks/system-admin/useSaveIrdConfig";
import ActionModal from "@/components/Modal/ActionModal";
import { Button, Input } from "rizzui";
import { PiEye, PiEyeSlash, PiGear } from "react-icons/pi";
import toast from "react-hot-toast";
import { errorHandler } from "@/utils/errorHandler";

interface TenantIrdTabProps {
  tenantId: number;
}

interface IrdFormValues {
  is_ird_certified: boolean;
  cbms_username: string;
  cbms_password: string;
  realtime: boolean;
}

const schema = yup.object({
  is_ird_certified: yup.boolean().required(),
  cbms_username: yup.string().when("is_ird_certified", {
    is: true,
    then: (s) => s.required("CBMS Username is required"),
    otherwise: (s) => s.optional(),
  }),
  cbms_password: yup.string().when("is_ird_certified", {
    is: true,
    then: (s) => s.required("CBMS Password is required"),
    otherwise: (s) => s.optional(),
  }),
  realtime: yup.boolean().required(),
});

export default function TenantIrdTab({ tenantId }: TenantIrdTabProps) {
  const { data, isLoading, isError } = useFetchIrdConfig(tenantId);
  const saveMutation = useSaveIrdConfig();
  const actionModal = useModal(ActionModal);
  const [showPassword, setShowPassword] = useState(false);

  const { register, watch, reset, getValues, formState: { errors }, trigger } = useForm<IrdFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      is_ird_certified: false,
      cbms_username: "",
      cbms_password: "",
      realtime: false,
    },
  });

  const isIrdCertified = watch("is_ird_certified");

  useEffect(() => {
    if (!data?.data) return;
    const { is_ird_certified, ird_credential } = data.data;
    reset({
      is_ird_certified,
      cbms_username: ird_credential?.cbms_username ?? "",
      cbms_password: ird_credential?.cbms_password ?? "",
      realtime: ird_credential?.realtime ?? false,
    });
  }, [data, reset]);

  const handleSave = async () => {
    const valid = await trigger();
    if (!valid) return;
    const values = getValues();
    actionModal.show({
      title: "Save IRD Configurations",
      text: "Are you sure you want to save the IRD configurations for this tenant?",
      isPrimary: true,
      icon: <PiGear size={24} className="text-blue-500" />,
      deleteButtonText: "Save",
      isLoading: saveMutation.isPending,
      handleAction: () => {
        saveMutation.mutate(
          {
            tenantId,
            is_ird_certified: values.is_ird_certified,
            cbms_username: values.cbms_username,
            cbms_password: values.cbms_password,
            is_realtime: values.realtime,
          },
          {
            onSuccess: () => {
              toast.success("IRD configurations saved successfully");
              actionModal.hide();
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
    return <p className="text-center text-gray-500">Loading IRD configurations...</p>;
  }

  if (isError || !data?.data) {
    return <p className="text-center text-red-500">Failed to load IRD configurations.</p>;
  }

  return (
    <div className="rounded-lg border border-gray-200 p-6">
      <h3 className="mb-6 text-sm font-semibold uppercase tracking-wide text-gray-500">
        IRD Configurations
      </h3>

      {/* IRD Certified checkbox */}
      <label className="flex cursor-pointer items-center gap-3 mb-6">
        <input
          type="checkbox"
          {...register("is_ird_certified")}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-800">IRD Certified</span>
      </label>

      {/* Form — only shown when IRD certified is checked */}
      {isIrdCertified && (
        <div className="space-y-5 mb-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              CBMS Username
            </label>
            <Input
              {...register("cbms_username")}
              placeholder="user@ird.gov.np"
              error={errors.cbms_username?.message}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              CBMS Password
            </label>
            <div className="relative">
              <input
                {...register("cbms_password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <PiEyeSlash className="h-4 w-4" /> : <PiEye className="h-4 w-4" />}
              </button>
            </div>
            {errors.cbms_password?.message && (
              <p className="mt-1 text-xs text-red-500">{errors.cbms_password.message}</p>
            )}
          </div>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              {...register("realtime")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-800">Realtime</span>
          </label>
        </div>
      )}

      <Button
        onClick={handleSave}
        isLoading={saveMutation.isPending}
        className="px-6"
      >
        Save Credentials
      </Button>
    </div>
  );
}
