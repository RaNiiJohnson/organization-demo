"use client";

import { authClient } from "@/lib/auth-client";

export default function OrgList() {
  const { data: organizations } = authClient.useListOrganizations();

  const { data: activeOrganization } = authClient.useActiveOrganization();
  return (
    <div>{activeOrganization ? <p>{activeOrganization.name}</p> : null}</div>
  );
}
