"use client";

import { useSystemAdminAuth } from "@/providers/SystemAdminAuthProvider";
import useFetchTenants from "@/api/hooks/system-admin/useFetchTenants";
import LoadingOverlay from "@/components/LoadingOverlay/LoadingOverlay";
import { Button, Text, Title } from "rizzui";
import StatisticsCards from "./statistics-cards";
import TenantsTable from "./tenants-table";
import CreateTenantModal from "./create-tenant-modal";
import { useModal } from "@ebay/nice-modal-react";
import ActionModal from "@/components/Modal/ActionModal";
import useSeedTenants from "@/api/hooks/system-admin/useSeedTenants";
import { errorHandler } from "@/utils/errorHandler";
import toast from "react-hot-toast";
import { PiSignOut, PiArrowClockwise } from "react-icons/pi";

export default function SystemAdminDashboard() {
  const { user, logout } = useSystemAdminAuth();
  const { data, isLoading } = useFetchTenants();
  const seedTenantsMutation = useSeedTenants();
  const createTenantModal = useModal(CreateTenantModal);
  const actionModal = useModal(ActionModal);

  const tenants = data?.tenants || [];

  const handleLogout = () => {
    logout("/login", "Logged out successfully");
  };

  const handleSeedTenants = () => {
    actionModal.show({
      title: "Seed All Tenants",
      text: "This will run seeders for all existing tenants. This operation may take several minutes. Are you sure you want to continue?",
      isLoading: seedTenantsMutation.isPending,
      isPrimary: true,
      icon: <PiArrowClockwise size={24} className="text-blue-500" />,
      deleteButtonText: "Seed Tenants",
      handleAction: () => {
        seedTenantsMutation.mutate(undefined, {
          onSuccess: (response) => {
            if (response.status === "success") {
              toast.success(
                response.message || `Seeded ${tenants.length} tenant(s)`
              );
              actionModal.hide();
            } else {
              toast.error(response.message || "Seeding failed");
            }
          },
          onError: (error) => {
            errorHandler(error);
          },
        });
      },
    });
  };

  return (
    <div className="relative min-h-screen bg-gray-50 p-6">
      <LoadingOverlay isVisible={isLoading || seedTenantsMutation.isPending} />

      <div className="mb-6 flex items-center justify-between">
        <div>
          <Title className="text-2xl font-bold">
            Welcome, {user?.name || "System Administrator"}
          </Title>
          <Text className="text-gray-600">
            Manage all tenants in the Billin system
          </Text>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSeedTenants}
            isLoading={seedTenantsMutation.isPending}
          >
            Seed Tenants
          </Button>
          <Button onClick={() => createTenantModal.show({ title: "Create Tenant" })}>
            Create Tenant
          </Button>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <PiSignOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <StatisticsCards tenants={tenants} />
      <TenantsTable tenants={tenants} isLoading={isLoading} />
    </div>
  );
}
