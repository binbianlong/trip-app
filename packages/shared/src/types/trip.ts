/**
 * Trip-related types
 */

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripInput {
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
}

export interface UpdateTripInput {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  destination?: string;
}
