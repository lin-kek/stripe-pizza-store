import { createUser, createUserToken, hasEmail } from "@/services/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Incomplete fields." });
  }

  const has = await hasEmail(email);
  if (has) return NextResponse.json({ error: "Email already in use." });

  const newUser = await createUser(name, email, password);
  if (!newUser)
    return NextResponse.json({
      error: "There was an error during user creation.",
    });

  const token = await createUserToken(newUser.id);

  return NextResponse.json({ user: newUser, token }, { status: 201 });
}
