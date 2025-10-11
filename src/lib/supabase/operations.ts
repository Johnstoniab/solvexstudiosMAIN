// @ts-nocheck
// src/lib/supabase/operations.ts

import { supabase } from './client';
import type { Database } from './database.types';

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

// --- NEW REAL-TIME SERVICE OPERATIONS ---

// Get all active (not deleted) services
export const getServices = async () => supabase.from('services').select('*').eq('is_deleted', false);

// Get all soft-deleted services for the restore view
export const getDeletedServices = async () => supabase.from('services').select('*').eq('is_deleted', true);

// Create a new service
export const createService = async (service: ServiceInsert) => supabase.from('services').insert(service).select().single();

// Update an existing service
export const updateService = async (id: string, service: ServiceUpdate) => supabase.from('services').update(service).eq('id', id).select().single();

// Soft delete a service by setting is_deleted to true
export const softDeleteService = async (id: string) => {
  return supabase
    .from('services')
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq('id', id);
};

// Restore a service by setting is_deleted to false
export const restoreService = async (id: string) => {
  return supabase
    .from('services')
    .update({ is_deleted: false, deleted_at: null })
    .eq('id', id);
};

// Listen for any changes in the services table
export const onServicesChange = (callback: () => void) => {
  return supabase
    .channel('public:services')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, callback)
    .subscribe();
};


// --- EXISTING OPERATIONS (Unchanged) ---

// FRONTEND-ONLY MODE:
// This file returns rental equipment from local data only.
// No Supabase calls, no env checks.

import { rentalEquipmentData } from "../../data/business/rentals.data";

const mapLocalToRow = (item: any) => ({
  title: item.title,
  subtitle: item.subtitle,
  category: item.category ?? null,
  price: typeof item.price === "number" ? item.price : null,
  video_url: item.videoUrl ?? null,
  features: item.features ?? [],
  images: item.images ?? [],
  status: item.status ?? "Available",
  created_at: null,
  id: null,
});

export const getRentalEquipment = async () => {
  const rows = (rentalEquipmentData || []).map(mapLocalToRow);
  return { data: rows, error: null };
};

export const getOrCreateClientForUser = async (userId: string, email?: string, fullName?: string) => ({ data: null, error: null });
export const createServiceRequest = async (...args: any[]) => ({ data: null, error: null });
export const listMyServiceRequests = async (...args: any[]) => ({ data: [], error: null });
export const updateRentalEquipment = async (...args: any[]) => ({ data: null, error: null });
export const getJobTeamsAndPositions = async (...args: any[]) => ({ data: { teams: [], positions: [] }, error: null });
export const updateJobTeam = async (...args: any[]) => ({ data: null, error: null });
export const updateJobPosition = async (...args: any[]) => ({ data: null, error: null });
export const listClientsWithStats = async (...args: any[]) => ({ data: [], error: null });
export const listServiceRequests = async (...args: any[]) => ({ data: [], error: null });
export const updateServiceRequestStatus = async (...args: any[]) => ({ data: null, error: null });
export const getCareerApplications = async (...args: any[]) => ({ data: [], error: null });
export const updateCareerApplicationStatus = async (...args: any[]) => ({ data: null, error: null });
export const createMember = async (...args: any[]) => ({ data: null, error: null });
export const getTeams = async () => ({ data: [], error: null });
export const getMembers = async () => ({ data: [], error: null });

export type ServiceRequestStatus =
  | "requested"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "pending";