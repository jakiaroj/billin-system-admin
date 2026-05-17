"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button, Input, Password } from "rizzui";
import useSystemAdminLogin from "@/api/hooks/system-admin/useSystemAdminLogin";
import { useSystemAdminAuth } from "@/providers/SystemAdminAuthProvider";
import { errorHandler } from "@/utils/errorHandler";
import toast from "react-hot-toast";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";

const loginSchema = yup.object().shape({
  mobile_no: yup
    .string()
    .required("Mobile number is required")
    .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  password: yup.string().required("Password is required"),
});

interface LoginFormData {
  mobile_no: string;
  password: string;
}

export default function LoginForm() {
  const loginMutation = useSystemAdminLogin();
  const { login } = useSystemAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: { mobile_no: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    loginMutation.mutate(data, {
      onSuccess: (response) => {
        const isSuccess =
          (response.status === "SUCCESS" ||
            response.status === "success" ||
            response.state === true) &&
          response.access_token &&
          response.system_admin;

        if (isSuccess && response.system_admin && response.access_token) {
          const user = {
            id: response.system_admin.id,
            name: response.system_admin.name,
            email: response.system_admin.email,
            mobile_no: response.system_admin.mobile_no,
            status: response.system_admin.status,
          };
          login(user, response.access_token, "/dashboard");
          toast.success("Login successful");
        } else {
          toast.error(response.message || "Login failed");
        }
      },
      onError: (error) => {
        errorHandler(error);
      },
    });
  };

  return (
    <div className="relative">
      <LoadingOverlay isVisible={loginMutation.isPending} />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Mobile Number"
          placeholder="Enter 10-digit mobile number"
          {...register("mobile_no")}
          error={errors.mobile_no?.message}
          maxLength={10}
          type="tel"
        />
        <Password
          label="Password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
        />
        <Button
          type="submit"
          className="w-full"
          isLoading={loginMutation.isPending}
        >
          Login
        </Button>
      </form>
    </div>
  );
}
