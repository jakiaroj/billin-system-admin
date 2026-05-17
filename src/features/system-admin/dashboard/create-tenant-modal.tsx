"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Input } from "rizzui";
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import useCreateTenant from "@/api/hooks/system-admin/useCreateTenant";
import ModalWrapper from "@/components/Modal/ModalWrapper";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import { errorHandler } from "@/utils/errorHandler";
import toast from "react-hot-toast";
import { CreateTenantRequest } from "@/types/system-admin";

const createTenantSchema = yup.object().shape({
  schema: yup
    .string()
    .required("Schema name is required")
    .matches(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores allowed"),
  businessName: yup.string().required("Business name is required"),
  industry: yup.string().required("Industry is required"),
  public_user_id: yup.number().transform((v) => (isNaN(v) ? undefined : v)).optional(),
});

interface CreateTenantModalProps {
  title: string;
}

export default NiceModal.create<CreateTenantModalProps>(
  ({ title }: CreateTenantModalProps) => {
    const modal = useModal();
    const createTenantMutation = useCreateTenant();

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<CreateTenantRequest>({
      resolver: yupResolver(createTenantSchema),
      defaultValues: { schema: "", businessName: "", industry: "", public_user_id: undefined },
    });

    const onSubmit = async (data: CreateTenantRequest) => {
      createTenantMutation.mutate(data, {
        onSuccess: (response) => {
          if (response.status === "success") {
            toast.success(
              `Tenant created successfully! Schema: ${response.details}`
            );
            reset();
            modal.hide();
          } else {
            toast.error(
              response.error || response.message || "Failed to create tenant"
            );
          }
        },
        onError: (error) => {
          errorHandler(error);
        },
      });
    };

    return (
      <>
        <LoadingOverlay isVisible={createTenantMutation.isPending} />
        <ModalWrapper
          isOpen={modal.visible}
          onClose={() => {
            modal.hide();
            reset();
          }}
          title={title}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Schema Name"
              placeholder="e.g. my_company"
              {...register("schema")}
              error={errors.schema?.message}
              helperText="Lowercase letters, numbers, and underscores only. Used as the database schema identifier."
            />
            <Input
              label="Business Name"
              placeholder="e.g. My Company Pvt. Ltd."
              {...register("businessName")}
              error={errors.businessName?.message}
            />
            <Input
              label="Industry"
              placeholder="e.g. Retail"
              {...register("industry")}
              error={errors.industry?.message}
            />
            <Input
              label="Public User ID"
              placeholder="e.g. 1"
              type="number"
              {...register("public_user_id")}
              error={errors.public_user_id?.message}
              helperText="Optional. Associate this tenant with an existing public user."
            />
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  modal.hide();
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={createTenantMutation.isPending}>
                Create Tenant
              </Button>
            </div>
          </form>
        </ModalWrapper>
      </>
    );
  }
);
