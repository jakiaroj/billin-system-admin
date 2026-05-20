"use client";

import { Tenant } from "@/types/system-admin";
import { differenceInDays, format } from "date-fns";
import { Badge, Button } from "rizzui";
import { PiCreditCard, PiCheckCircle, PiXCircle } from "react-icons/pi";
import Image from "next/image";

interface TenantsTableProps {
  tenants: Tenant[];
  isLoading: boolean;
  onSubscribe: (tenant: Tenant) => void;
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "active" ? "success"
    : status === "trialing" ? "warning"
    : status === "past_due" ? "danger"
    : "danger";
  return (
    <Badge color={color} variant="flat" className="capitalize whitespace-nowrap">
      {status.replace("_", " ")}
    </Badge>
  );
}

function BooleanFlag({ value, label }: { value: boolean; label: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-gray-600">
      {value ? (
        <PiCheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <PiXCircle className="h-4 w-4 text-gray-300" />
      )}
      {label}
    </span>
  );
}

function TrialDaysRemaining({ endsAt }: { endsAt: string }) {
  const days = differenceInDays(new Date(endsAt), new Date());
  if (days < 0) return <span className="text-xs text-red-500">Expired</span>;
  if (days === 0) return <span className="text-xs text-red-500">Ends today</span>;
  return (
    <span className={`text-xs font-medium ${days <= 3 ? "text-red-500" : days <= 7 ? "text-orange-500" : "text-green-600"}`}>
      {days}d left
    </span>
  );
}

export default function TenantsTable({ tenants, isLoading, onSubscribe }: TenantsTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-center text-gray-500">Loading tenants...</p>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <p className="text-center text-gray-500">No tenants found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">
        Tenant List{" "}
        <span className="text-sm font-normal text-gray-400">({tenants.length})</span>
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 pr-4 font-semibold text-gray-700">#</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">Business</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">Owner</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">Domain / Schema</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">Status</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">Features</th>
              <th className="pb-3 pr-4 font-semibold text-gray-700">Trial Period</th>
              <th className="pb-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="border-b border-gray-100 last:border-0">

                {/* ID */}
                <td className="py-3 pr-4 font-medium text-gray-400">{tenant.id}</td>

                {/* Business: logo + name + address + VAT */}
                <td className="py-3 pr-4">
                  <div className="flex items-start gap-3">
                    {tenant.logo ? (
                      <Image
                        src={tenant.logo}
                        alt={tenant.business_name}
                        width={32}
                        height={32}
                        className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-bold text-gray-400">
                        {tenant.business_name?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{tenant.business_name || "—"}</p>
                      {tenant.address && (
                        <p className="text-xs text-gray-500">{tenant.address}</p>
                      )}
                      {tenant.vat_no && (
                        <p className="text-xs text-gray-400">VAT: {tenant.vat_no}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Owner */}
                <td className="py-3 pr-4">
                  {tenant.public_user ? (
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">
                        {tenant.public_user.first_name} {tenant.public_user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{tenant.public_user.email}</p>
                      <p className="text-xs text-gray-400">{tenant.public_user.mobile_no}</p>
                    </div>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                {/* Domain + Schema */}
                <td className="py-3 pr-4">
                  <a
                    href={tenant.domainUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline"
                  >
                    {tenant.domainUrl}
                  </a>
                  <p className="mt-0.5 font-mono text-xs text-gray-400">{tenant.schema_name}</p>
                </td>

                {/* Status */}
                <td className="py-3 pr-4">
                  <StatusBadge status={tenant.status} />
                </td>

                {/* Features */}
                <td className="py-3 pr-4">
                  <div className="flex flex-col gap-1">
                    <BooleanFlag value={tenant.is_cbms_enabled} label="CBMS" />
                    <BooleanFlag value={tenant.is_ird_certified} label="IRD" />
                  </div>
                </td>

                {/* Trial Period */}
                <td className="py-3 pr-4 text-gray-600">
                  {tenant.trial_starts_at ? (
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span>
                        <span className="text-gray-400">From </span>
                        {format(new Date(tenant.trial_starts_at), "MMM dd, yyyy")}
                      </span>
                      <span>
                        <span className="text-gray-400">To </span>
                        {tenant.trial_ends_at
                          ? format(new Date(tenant.trial_ends_at), "MMM dd, yyyy")
                          : "—"}
                      </span>
                      {tenant.trial_ends_at && tenant.status === "trialing" && (
                        <TrialDaysRemaining endsAt={tenant.trial_ends_at} />
                      )}
                    </div>
                  ) : (
                    "—"
                  )}
                </td>

                {/* Actions */}
                <td className="py-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSubscribe(tenant)}
                    className="flex items-center gap-1.5"
                  >
                    <PiCreditCard className="h-4 w-4" />
                    Subscribe
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
