import Link from "next/link";
import AuthButton from "./authButton";
import { ThemeToggle } from "./theme-toggle";
import { Bell } from "lucide-react";
import { getUser } from "@/lib/auth-server";
import { OrganizationSwitcher } from "./organization-switcher";
import { getOrganizations } from "@/server/organisation";

export default async function Header() {
  const user = await getUser();
  const organization = getOrganizations();
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur">
      <div className="mx-auto flex items-center gap-4 px-4 py-2">
        <Link
          href="/"
          className="text-2xl font-bold text-primary hover:opacity-80 transition"
        >
          Plume
        </Link>
        <OrganizationSwitcher organizations={organization} />
        <span className="flex-1" />
        <AuthButton />
        {user && <Bell size={18} />}
        <ThemeToggle />
      </div>
    </header>
  );
}
