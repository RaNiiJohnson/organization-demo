"use client";

import { authClient } from "@/lib/auth-client";

export default function OrgList() {
  const { data: organizations } = authClient.useListOrganizations();

  return (
    <div>
      {organizations?.map((org) => (
        <p key={org.id}>{org.name}</p>
      ))}
    </div>
  );
}
