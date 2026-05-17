"use client";

import { Tenant } from "@/types/system-admin";
import { Title, Text } from "rizzui";
import NumberWithCommas from "@/components/NumberCommas/NumberCommas";
import { useMemo, useState, useEffect } from "react";

interface StatisticsCardsProps {
  tenants: Tenant[];
}

export default function StatisticsCards({ tenants }: StatisticsCardsProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const totalTenants = tenants.length;
  const activeTenants = tenants.filter((t) => t.status === "active").length;

  const recentlyCreated = useMemo(() => {
    if (!mounted) return 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return tenants.filter((t) => {
      if (!t.trial_starts_at) return false;
      return new Date(t.trial_starts_at) >= thirtyDaysAgo;
    }).length;
  }, [mounted, tenants]);

  const stats = [
    {
      title: "Total Tenants",
      value: totalTenants,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Tenants",
      value: activeTenants,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Recently Created",
      value: recentlyCreated,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      subtitle: "Last 30 days",
    },
    {
      title: "Total Schemas",
      value: totalTenants,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className={`mb-2 inline-block rounded-lg p-3 ${stat.bgColor}`}>
            <Text className={`text-2xl font-bold ${stat.color}`}>
              <NumberWithCommas value={stat.value} />
            </Text>
          </div>
          <Title className="text-sm font-semibold text-gray-700">{stat.title}</Title>
          {stat.subtitle && (
            <Text className="mt-1 text-xs text-gray-500">{stat.subtitle}</Text>
          )}
        </div>
      ))}
    </div>
  );
}
