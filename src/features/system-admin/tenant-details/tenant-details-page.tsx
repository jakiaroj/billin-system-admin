"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "rizzui";
import { PiArrowLeft } from "react-icons/pi";
import TenantFeaturesTab from "./tenant-features-tab";
import TenantOverviewTab from "./tenant-overview-tab";
import TenantPaymentsTab from "./tenant-payments-tab";
import TenantIrdTab from "./tenant-ird-tab";

interface TenantDetailsPageProps {
  tenantId: number;
}

const TABS = [
  { key: "overview", label: "Tenant Overview" },
  { key: "payments", label: "Payments" },
  { key: "features", label: "Tenant Features" },
  { key: "ird", label: "IRD Configurations" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function TenantDetailsPage({ tenantId }: TenantDetailsPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-1.5"
        >
          <PiArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 pt-6">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Tenant Details</h1>
          <div className="flex gap-0">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <TenantOverviewTab tenantId={tenantId} />
          )}
          {activeTab === "payments" && (
            <TenantPaymentsTab tenantId={tenantId} />
          )}
          {activeTab === "features" && (
            <TenantFeaturesTab tenantId={tenantId} />
          )}
          {activeTab === "ird" && (
            <TenantIrdTab tenantId={tenantId} />
          )}
        </div>
      </div>
    </div>
  );
}
