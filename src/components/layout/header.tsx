import Link from "next/link";
import { Button } from "../ui/button";
import CartButton from "../cart/cart-button";
import LoginButton from "../auth/login-button";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return (
    <header className="container mx-auto flex flex-col md:flex-row gap-4 md:gap-0 my-4 p-5 items-center justify-center md:justify-between bg-secondary rounded-md">
      <Link href={"/"}>
        <div className="text-2xl">
          <span className="font-bold">Pizza</span> Store 🍕
        </div>
      </Link>
      <div className="flex gap-2">
        <LoginButton initialState={token ? true : false} />
        <CartButton />
      </div>
    </header>
  );
}
