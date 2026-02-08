import { supabase } from "./supabase";

/**
 * API client for communicating with Supabase Edge Functions or Local API
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_LOCAL_API_URL;
const FUNCTIONS_URL = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1`;

interface FunctionCallOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
}

/**
 * Call a Supabase Edge Function or Local API
 */
async function callFunction<T>(
  functionName: string,
  path: string,
  options: FunctionCallOptions = {}
): Promise<T> {
  const { method = "GET", body } = options;

  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // ローカルAPIの場合は functionName を含めない
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : `${FUNCTIONS_URL}/${functionName}${path}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
}

/**
 * Welcome API
 */
export const welcomeApi = {
  async getWelcome(): Promise<{ title: string; message: string; description: string }> {
    return callFunction("api", "/welcome");
  },
};
