"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuth } from "@/stores/auth";
import { LogOut, ShoppingBag, User } from "lucide-react";

type Props = {
  initialState: boolean;
};

export default function LoginButton({ initialState }: Props) {
  const auth = useAuth();
  const [authState, setAuthState] = useState<boolean>(initialState);

  useEffect(() => {
    setAuthState(auth.token ? true : false);
  }, [auth]);

  function handleLogout() {
    auth.setToken(null);
  }

  if (authState) {
    return (
      <>
        <Button onClick={handleLogout} className="cursor-pointer">
          <LogOut />
          Logout
        </Button>
        <Link href="/orders">
          <Button className="cursor-pointer">
            <ShoppingBag /> Orders
          </Button>
        </Link>
      </>
    );
  }

  return (
    <Button onClick={() => auth.setOpen(true)} className="cursor-pointer">
      <User />
      Login / Register
    </Button>
  );
}
