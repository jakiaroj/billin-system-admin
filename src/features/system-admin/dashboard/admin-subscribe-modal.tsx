"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Input } from "rizzui";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import useAdminSubscribe from "@/api/hooks/system-admin/useAdminSubscribe";
import useFetchPlans from "@/api/hooks/system-admin/useFetchPlans";
import ModalWrapper from "@/components/Modal/ModalWrapper";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import { errorHandler } from "@/utils/errorHandler";
import toast from "react-hot-toast";
import { Tenant } from "@/types/system-admin";

const schema = yup.object().shape({
  plan_id: yup
    .number()
    .transform((v) => (isNaN(v) ? undefined : v))
    .required("Plan is required"),
  amount_npr: yup
    .number()
    .transform((v) => (isNaN(v) ? undefined : v))
    .min(0, "Amount must be positive")
    .optional(),
  transaction_id: yup.string().optional(),
});

interface FormValues {
  plan_id: number;
  amount_npr?: number;
  transaction_id?: string;
}

type TriState = "" | "true" | "false";

const SELECT_CLASS =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

interface AdminSubscribeModalProps {
  tenant: Tenant;
}

export default NiceModal.create<AdminSubscribeModalProps>(
  ({ tenant }: AdminSubscribeModalProps) => {
    const modal = useModal();
    const adminSubscribeMutation = useAdminSubscribe();
    const { data: plansData, isLoading: plansLoading } = useFetchPlans();
    const plans = plansData?.data ?? [];

    const [irdCertified, setIrdCertified] = useState<TriState>("");
    const [cbmsEnabled, setCbmsEnabled] = useState<TriState>("");

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      watch,
      setValue,
    } = useForm<FormValues>({
      resolver: yupResolver(schema),
      defaultValues: { plan_id: undefined, amount_npr: undefined, transaction_id: "" },
    });

    const selectedPlanId = watch("plan_id");

    useEffect(() => {
      if (!selectedPlanId) return;
      const plan = plans.find((p) => p.id === Number(selectedPlanId));
      if (plan) setValue("amount_npr", plan.price_cents / 100);
    }, [selectedPlanId, plans, setValue]);

    const handleClose = () => {
      modal.hide();
      reset();
      setIrdCertified("");
      setCbmsEnabled("");
    };

    const onSubmit = (data: FormValues) => {
      adminSubscribeMutation.mutate(
        {
          tenantId: tenant.id,
          plan_id: data.plan_id,
          amount_cents: data.amount_npr !== undefined ? Math.round(data.amount_npr * 100) : undefined,
          transaction_id: data.transaction_id || undefined,
          is_ird_certified: irdCertified !== "" ? irdCertified === "true" : undefined,
          is_cbms_enabled: cbmsEnabled !== "" ? cbmsEnabled === "true" : undefined,
        },
        {
          onSuccess: (response) => {
            toast.success(response.message || "Subscription activated successfully");
            handleClose();
          },
          onError: (error) => {
            errorHandler(error);
          },
        }
      );
    };

    return (
      <>
        <LoadingOverlay isVisible={adminSubscribeMutation.isPending} />
        <ModalWrapper
          isOpen={modal.visible}
          onClose={handleClose}
          title={`Manual Subscribe — ${tenant.business_name}`}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Plan */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">
                Plan <span className="text-red-500">*</span>
              </label>
              {plansLoading ? (
                <p className="text-sm text-gray-400">Loading plans...</p>
              ) : (
                <select
                  {...register("plan_id")}
                  className={SELECT_CLASS}
                  defaultValue=""
                >
                  <option value="" disabled>Select a plan</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — NPR {(plan.price_cents / 100).toLocaleString()} / {plan.interval}
                    </option>
                  ))}
                </select>
              )}
              {errors.plan_id && (
                <p className="text-xs text-red-500">{errors.plan_id.message}</p>
              )}
            </div>

            {/* Amount */}
            <Input
              label="Amount (NPR)"
              placeholder="Defaults to plan price"
              type="number"
              step="0.01"
              {...register("amount_npr")}
              error={errors.amount_npr?.message}
              helperText="Leave blank to use the plan's listed price."
            />

            {/* Transaction ID */}
            <Input
              label="Transaction ID"
              placeholder="e.g. BANK-REF-20260519"
              {...register("transaction_id")}
              error={errors.transaction_id?.message}
              helperText="Optional. Cheque number, bank transfer reference, etc."
            />

            {/* IRD & CBMS flags */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  IRD Certified
                </label>
                <select
                  value={irdCertified}
                  onChange={(e) => setIrdCertified(e.target.value as TriState)}
                  className={SELECT_CLASS}
                >
                  <option value="">No change (currently: {tenant.is_ird_certified ? "Yes" : "No"})</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  CBMS Enabled
                </label>
                <select
                  value={cbmsEnabled}
                  onChange={(e) => setCbmsEnabled(e.target.value as TriState)}
                  className={SELECT_CLASS}
                >
                  <option value="">No change (currently: {tenant.is_cbms_enabled ? "Yes" : "No"})</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={adminSubscribeMutation.isPending}
                disabled={plansLoading}
              >
                Activate Subscription
              </Button>
            </div>
          </form>
        </ModalWrapper>
      </>
    );
  }
);
