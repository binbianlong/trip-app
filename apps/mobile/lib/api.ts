import type { CreateTripInput, Trip, UpdateTripInput } from "@trip-app/shared";
import { supabase } from "./supabase";

/**
 * API client for communicating with Supabase Edge Functions
 */

const FUNCTIONS_URL = `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1`;

interface FunctionCallOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: unknown;
}

/**
 * Call a Supabase Edge Function
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

  const url = `${FUNCTIONS_URL}/${functionName}${path}`;

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
 * Trip API endpoints
 */
export const tripApi = {
  /**
   * Get all trips
   */
  async getTrips(): Promise<{ trips: Trip[] }> {
    return callFunction("api", "/api/trips");
  },

  /**
   * Get a single trip by ID
   */
  async getTrip(id: string): Promise<{ trip: Trip }> {
    return callFunction("api", `/api/trips/${id}`);
  },

  /**
   * Create a new trip
   */
  async createTrip(input: CreateTripInput): Promise<{ success: boolean; trip: Trip }> {
    return callFunction("api", "/api/trips", {
      method: "POST",
      body: input,
    });
  },

  /**
   * Update a trip
   */
  async updateTrip(id: string, input: UpdateTripInput): Promise<{ success: boolean; trip: Trip }> {
    return callFunction("api", `/api/trips/${id}`, {
      method: "PUT",
      body: input,
    });
  },

  /**
   * Delete a trip
   */
  async deleteTrip(id: string): Promise<{ success: boolean }> {
    return callFunction("api", `/api/trips/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Health check
 */
export const healthApi = {
  async check(): Promise<{ status: string; timestamp: string }> {
    return callFunction("api", "/health");
  },
};
