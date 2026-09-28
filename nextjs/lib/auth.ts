import { cookies } from "next/headers";
import { User } from "./types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_KEY)?.value;
  return token ? decodeURIComponent(token) : null;
}

export async function setAuthSession(token: string, user: User): Promise<void> {
  const cookieStore = await cookies();
  const isSecure = process.env.SECURE_COOKIES === "true";

  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  const encodedUser = encodeURIComponent(JSON.stringify(user));
  cookieStore.set(USER_KEY, encodedUser, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get(USER_KEY)?.value;
  if (!userCookie) return null;

  try {
    const decoded = decodeURIComponent(userCookie);
    return JSON.parse(decoded) as User;
  } catch {
    return null;
  }
}

export async function clearAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
  cookieStore.delete(USER_KEY);
}
