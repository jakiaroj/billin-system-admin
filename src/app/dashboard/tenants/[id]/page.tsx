import TenantDetailsPage from "@/features/system-admin/tenant-details/tenant-details-page";

export default function TenantDetails({ params }: { params: { id: string } }) {
  return <TenantDetailsPage tenantId={Number(params.id)} />;
}
