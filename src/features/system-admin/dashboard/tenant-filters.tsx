"use client";

import { useEffect, useState } from "react";
import { Input, Button } from "rizzui";
import { TenantFilters } from "@/types/system-admin";
import { PiX } from "react-icons/pi";

interface TenantFiltersProps {
  onFiltersChange: (filters: TenantFilters) => void;
}

const STATUS_OPTIONS = [
  { label: "All statuses", value: "" },
  { label: "Trialing", value: "trialing" },
  { label: "Active", value: "active" },
  { label: "Past Due", value: "past_due" },
  { label: "Canceled", value: "canceled" },
];

const BOOL_OPTIONS = [
  { label: "Any", value: "" },
  { label: "Yes", value: "true" },
  { label: "No", value: "false" },
];

const SELECT_CLASS =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 h-10";

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function TenantFiltersBar({ onFiltersChange }: TenantFiltersProps) {
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [schemaName, setSchemaName] = useState("");
  const [domainUrl, setDomainUrl] = useState("");
  const [vatNo, setVatNo] = useState("");
  const [status, setStatus] = useState("");
  const [isIrdCertified, setIsIrdCertified] = useState("");
  const [isCbmsEnabled, setIsCbmsEnabled] = useState("");

  const dBusinessName = useDebounce(businessName);
  const dIndustry = useDebounce(industry);
  const dSchemaName = useDebounce(schemaName);
  const dDomainUrl = useDebounce(domainUrl);
  const dVatNo = useDebounce(vatNo);

  useEffect(() => {
    const filters: TenantFilters = {};
    if (dBusinessName) filters.business_name = dBusinessName;
    if (dIndustry) filters.industry = dIndustry;
    if (dSchemaName) filters.schema_name = dSchemaName;
    if (dDomainUrl) filters.domain_url = dDomainUrl;
    if (dVatNo) filters.vat_no = dVatNo;
    if (status) filters.status = status;
    if (isIrdCertified !== "") filters.is_ird_certified = isIrdCertified === "true";
    if (isCbmsEnabled !== "") filters.is_cbms_enabled = isCbmsEnabled === "true";
    onFiltersChange(filters);
  }, [dBusinessName, dIndustry, dSchemaName, dDomainUrl, dVatNo, status, isIrdCertified, isCbmsEnabled, onFiltersChange]);

  const hasFilters =
    businessName || industry || schemaName || domainUrl || vatNo ||
    status || isIrdCertified || isCbmsEnabled;

  const clearAll = () => {
    setBusinessName("");
    setIndustry("");
    setSchemaName("");
    setDomainUrl("");
    setVatNo("");
    setStatus("");
    setIsIrdCertified("");
    setIsCbmsEnabled("");
  };

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Filters</p>
        {hasFilters && (
          <Button variant="text" size="sm" onClick={clearAll} className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <PiX className="h-3.5 w-3.5" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Input
          placeholder="Business name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          inputClassName="h-10 text-sm"
        />
        <Input
          placeholder="Industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          inputClassName="h-10 text-sm"
        />
        <Input
          placeholder="Schema name"
          value={schemaName}
          onChange={(e) => setSchemaName(e.target.value)}
          inputClassName="h-10 text-sm"
        />
        <Input
          placeholder="Domain URL"
          value={domainUrl}
          onChange={(e) => setDomainUrl(e.target.value)}
          inputClassName="h-10 text-sm"
        />
        <Input
          placeholder="VAT no."
          value={vatNo}
          onChange={(e) => setVatNo(e.target.value)}
          inputClassName="h-10 text-sm"
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)} className={SELECT_CLASS}>
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select value={isIrdCertified} onChange={(e) => setIsIrdCertified(e.target.value)} className={SELECT_CLASS}>
          <option value="">IRD certified — Any</option>
          {BOOL_OPTIONS.filter(o => o.value !== "").map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select value={isCbmsEnabled} onChange={(e) => setIsCbmsEnabled(e.target.value)} className={SELECT_CLASS}>
          <option value="">CBMS enabled — Any</option>
          {BOOL_OPTIONS.filter(o => o.value !== "").map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
