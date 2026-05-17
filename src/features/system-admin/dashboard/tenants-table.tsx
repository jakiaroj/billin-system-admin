"use client";

import { Tenant } from "@/types/system-admin";
import { format } from "date-fns";
import { Badge } from "rizzui";

interface TenantsTableProps {
  tenants: Tenant[];
  isLoading: boolean;
}

const columns = [
  { name: "ID", uid: "id" },
  { name: "Business Name", uid: "business_name" },
  { name: "Domain URL", uid: "domainUrl" },
  { name: "Schema Name", uid: "schema_name" },
  { name: "Status", uid: "status" },
  { name: "Trial Ends", uid: "trial_ends_at" },
];

export default function TenantsTable({ tenants, isLoading }: TenantsTableProps) {
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
      <h2 className="mb-4 text-lg font-semibold">Tenant List</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((col) => (
                <th key={col.uid} className="pb-3 pr-4 font-semibold text-gray-700">
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="border-b border-gray-100 last:border-0">
                <td className="py-3 pr-4 font-medium">{tenant.id}</td>
                <td className="py-3 pr-4">{tenant.business_name || "—"}</td>
                <td className="py-3 pr-4">
                  <a
                    href={tenant.domainUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {tenant.domainUrl}
                  </a>
                </td>
                <td className="py-3 pr-4 font-mono text-sm">{tenant.schema_name}</td>
                <td className="py-3 pr-4">
                  <Badge
                    color={tenant.status === "active" ? "success" : tenant.status === "trialing" ? "warning" : "danger"}
                    variant="flat"
                  >
                    {tenant.status}
                  </Badge>
                </td>
                <td className="py-3 pr-4 text-gray-600">
                  {tenant.trial_ends_at ? format(new Date(tenant.trial_ends_at), "MMM dd, yyyy") : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
