"use server";

import { loginApi, registerApi, logoutApi } from "@/services/authService";
import { setAuthSession, clearAuthSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function loginAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Todos los campos son obligatorios" };
  }

  try {
    const authData = await loginApi({ email, password });
    await setAuthSession(authData.token, authData.user);
    revalidatePath("/", "layout");
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Error al iniciar sesión";
    return { success: false, error };
  }

  redirect("/products");
}

export async function registerAction(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const password_confirmation = formData.get("password_confirmation") as string;

  if (!name || !email || !password) {
    return { success: false, error: "Todos los campos obligatorios deben completarse" };
  }

  if (password.length < 6) {
    return { success: false, error: "La contraseña debe tener al menos 6 caracteres" };
  }

  if (password_confirmation && password !== password_confirmation) {
    return { success: false, error: "Las contraseñas no coinciden" };
  }

  try {
    const authData = await registerApi({
      name,
      email,
      password,
      password_confirmation,
    });
    await setAuthSession(authData.token, authData.user);
    revalidatePath("/", "layout");
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : "Error al registrar la cuenta";
    return { success: false, error };
  }

  redirect("/products");
}

export async function logoutAction(): Promise<void> {
  await logoutApi();
  await clearAuthSession();
  revalidatePath("/", "layout");
  redirect("/login");
}
