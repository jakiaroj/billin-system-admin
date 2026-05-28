"use client";

import useFetchTenantPayments from "@/api/hooks/system-admin/useFetchTenantPayments";
import { format } from "date-fns";
import { Badge } from "rizzui";

interface TenantPaymentsTabProps {
  tenantId: number;
}

function PaymentStatusBadge({ status }: { status: string }) {
  const color =
    status === "paid" ? "success"
    : status === "pending" ? "warning"
    : status === "failed" ? "danger"
    : "default";
  return (
    <Badge color={color} variant="flat" className="capitalize">
      {status}
    </Badge>
  );
}

function formatAmount(cents: number) {
  return `Rs. ${(cents / 100).toLocaleString("en-NP", { minimumFractionDigits: 2 })}`;
}

function formatDate(date: string | null) {
  if (!date) return "—";
  return format(new Date(date), "MMM dd, yyyy hh:mm a");
}

export default function TenantPaymentsTab({ tenantId }: TenantPaymentsTabProps) {
  const { data, isLoading, isError } = useFetchTenantPayments(tenantId);

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading payments...</p>;
  }

  if (isError || !data?.data) {
    return <p className="text-center text-red-500">Failed to load payments.</p>;
  }

  if (data.data.length === 0) {
    return <p className="text-center text-gray-400">No payments found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-3 pr-4 font-semibold text-gray-700">Transaction ID</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">Amount</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">Status</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">Type</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">Billing Reason</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">Paid At</th>
            <th className="pb-3 pr-4 font-semibold text-gray-700">Created At</th>
            <th className="pb-3 font-semibold text-gray-700">Subscription</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((p) => (
            <tr
              key={p.id}
              className="border-b border-gray-100 last:border-0"
            >
              <td className="py-3 pr-4 font-mono text-xs text-gray-700">
                {p.transaction_id ?? "—"}
              </td>
              <td className="py-3 pr-4 font-medium text-gray-900">
                {formatAmount(p.amount_cents)}
              </td>
              <td className="py-3 pr-4">
                <PaymentStatusBadge status={p.status} />
              </td>
              <td className="py-3 pr-4 capitalize text-gray-600">
                {p.payment_type}
              </td>
              <td className="py-3 pr-4 text-gray-600">
                {p.billing_reason.replace(/_/g, " ")}
              </td>
              <td className="py-3 pr-4 text-gray-600">{formatDate(p.paid_at)}</td>
              <td className="py-3 pr-4 text-gray-600">{formatDate(p.created_at)}</td>
              <td className="py-3">
                {p.is_active_subscription && (
                  <Badge color="success" variant="flat">Active Subscription</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
