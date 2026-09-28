import { fetchApi } from "@/lib/api";
import { AuthResponse, User } from "@/lib/types";

export async function loginApi(credentials: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetchApi<AuthResponse | { data: AuthResponse; token?: string; access_token?: string; user?: User }>(
    "/login",
    {
      method: "POST",
      body: JSON.stringify(credentials),
    }
  );

  // Normalize API response format (support Laravel Sanctum / Passport)
  if ("token" in res && "user" in res) {
    return res as AuthResponse;
  }
  if ("access_token" in res && "user" in res) {
    return {
      token: (res as { access_token: string }).access_token,
      user: (res as { user: User }).user,
    };
  }
  if ("data" in res && res.data && "token" in res.data) {
    return res.data;
  }

  throw new Error("Formato de respuesta de autenticación no reconocido");
}

export async function registerApi(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
}): Promise<AuthResponse> {
  const payload = {
    ...data,
    password_confirmation: data.password_confirmation || data.password,
  };

  const res = await fetchApi<AuthResponse | { data: AuthResponse; token?: string; access_token?: string; user?: User }>(
    "/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if ("token" in res && "user" in res) {
    return res as AuthResponse;
  }
  if ("access_token" in res && "user" in res) {
    return {
      token: (res as { access_token: string }).access_token,
      user: (res as { user: User }).user,
    };
  }
  if ("data" in res && res.data && "token" in res.data) {
    return res.data;
  }

  throw new Error("Formato de respuesta de registro no reconocido");
}

export async function logoutApi(): Promise<void> {
  try {
    await fetchApi("/logout", {
      method: "POST",
      requiresAuth: true,
    });
  } catch (error) {
    console.warn("Fallo al cerrar sesión en servidor Laravel:", error);
  }
}
