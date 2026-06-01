"use client";

import useFetchTenantDetail from "@/api/hooks/system-admin/useFetchTenantDetail";
import { format } from "date-fns";
import Image from "next/image";
import { Badge } from "rizzui";

interface TenantOverviewTabProps {
  tenantId: number;
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "active" ? "success"
    : status === "trialing" ? "warning"
    : status === "past_due" ? "danger"
    : "danger";
  return (
    <Badge color={color} variant="flat" className="capitalize">
      {status.replace("_", " ")}
    </Badge>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <div className="text-sm text-gray-900">{value ?? "—"}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
      {children}
    </h3>
  );
}

function formatDate(date: string | null) {
  if (!date) return null;
  return format(new Date(date), "MMM dd, yyyy");
}

export default function TenantOverviewTab({ tenantId }: TenantOverviewTabProps) {
  const { data, isLoading, isError } = useFetchTenantDetail(tenantId);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (isError || !data?.data) {
    return <p className="text-center text-red-500">Failed to load tenant details.</p>;
  }

  const t = data.data;
  const sub = t.subscription;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        {t.logo ? (
          <Image
            src={t.logo}
            alt={t.business_name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-2xl font-bold text-gray-400">
            {t.business_name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t.business_name}</h2>
          <p className="mt-0.5 text-sm text-gray-500 capitalize">{t.industry}</p>
          <div className="mt-1.5">
            <StatusBadge status={t.status} />
          </div>
        </div>
      </div>

      {/* Business Info */}
      <div className="rounded-lg border border-gray-200 p-6">
        <SectionTitle>Business Info</SectionTitle>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Status" value={<StatusBadge status={t.status} />} />
          <Field label="Schema Name" value={<span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded">{t.schema_name}</span>} />
          <Field
            label="Domain URL"
            value={
              t.domain_url ? (
                <a href={t.domain_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                  {t.domain_url}
                </a>
              ) : null
            }
          />
          <Field label="VAT No." value={t.vat_no} />
          <Field label="Address" value={t.address} />
          {t.status === "trialing" && (
            <>
              <Field label="Trial Start" value={formatDate(t.trial_starts_at)} />
              <Field label="Trial End" value={formatDate(t.trial_ends_at)} />
            </>
          )}
        </div>
      </div>

      {/* Subscription */}
      <div className="rounded-lg border border-gray-200 p-6">
        <SectionTitle>Subscription</SectionTitle>
        {sub ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Plan" value={<span className="font-medium">{sub.plan.name}</span>} />
            <Field label="Interval" value={<span className="capitalize">{sub.plan.interval}</span>} />
            <Field label="Subscription Status" value={<StatusBadge status={sub.status} />} />
            <Field label="Period Start" value={formatDate(sub.current_period_start)} />
            <Field label="Period End" value={formatDate(sub.current_period_end)} />
            <Field label="Canceled At" value={formatDate(sub.canceled_at)} />
          </div>
        ) : (
          <p className="text-sm text-gray-400">No active subscription.</p>
        )}
      </div>

    </div>
  );
}
