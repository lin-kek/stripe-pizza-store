import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { v4 } from "uuid";

export async function hasEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  return user ? true : false;
}

export async function validateAuth(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) return false;
  if (!bcrypt.compareSync(password, user.password)) return false;

  return {
    id: user.id,
    name: user.name,
    email: user.name,
  };
}

export async function createUser(
  name: string,
  email: string,
  password: string,
) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
      },
    });
    return {
      id: user.id,
      name: user.name,
      email: user.name,
    };
  } catch (error) {
    return null;
  }
}

export async function createUserToken(userId: number) {
  const token = v4();

  await prisma.user.update({
    where: { id: userId },
    data: { token },
  });

  return token;
}

export async function getLoggedUserFromHeader() {
  const headersList = await headers();
  const authorization = headersList.get("authorization")?.split(" ");

  if (!authorization) return null;

  if (authorization[0] !== "Token") return null;

  if (!authorization[1]) return null;

  const token = authorization[1];
  const user = await prisma.user.findFirst({
    select: {
      name: true,
      id: true,
      email: true,
    },
    where: { token },
  });

  return user;
}
