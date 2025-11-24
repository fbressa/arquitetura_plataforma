"use client";

import { useAppContext } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout, userInfo } = useAppContext();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!userInfo) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  );
}
