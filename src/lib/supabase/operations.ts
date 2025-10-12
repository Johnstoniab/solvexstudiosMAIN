// @ts-nocheck
// src/lib/supabase/operations.ts

import { supabase } from './client';
import type { Database } from './database.types';

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

// --- RENTAL EQUIPMENT OPERATIONS (NEW) ---
// Changed from 'rental_equipment' to 'rentals' to match migration file names
export type RentalEquipment = Database['public']['Tables']['rentals']['Row'];

// Fetches all equipment for the public (only 'Available' status)
export const getRentalEquipment = async () => {
  // Changed from 'rental_equipment' to 'rentals'
  return supabase.from('rentals').select('*').eq('is_available', true);
};

// Fetches ALL equipment for the admin dashboard
export const getAllRentalEquipment = async () => {
  // Changed from 'rental_equipment' to 'rentals'
  return supabase.from('rentals').select('*');
};


// Updates a piece of rental equipment
export const updateRentalEquipment = async (id: string, updates: Partial<RentalEquipment>) => {
  // Changed from 'rental_equipment' to 'rentals'
  return supabase.from('rentals').update(updates).eq('id', id);
};

// Subscribes to real-time changes on the rentals table
export const onRentalEquipmentChange = (callback: () => void) => {
  return supabase
    .channel('public:rentals')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rentals' }, callback)
    .subscribe();
};


// --- REAL-TIME SERVICE OPERATIONS ---

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
export const onServicesChange = (callback: (payload: any) => void) => {
  return supabase
    .channel('public:services')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, callback)
    .subscribe();
};


// --- EXISTING OPERATIONS (Unchanged but using generic names, will need full implementation) ---

// NOTE: These mock the operation signature but will need real Supabase logic using the 'requests' table.
export const getOrCreateClientForUser = async (userId: string, email?: string, fullName?: string) => ({ data: null, error: null });

// Changed from 'service_requests' to 'requests' table in database.types.ts
export const createServiceRequest = async (...args: any[]) => ({ data: null, error: null });
export const listMyServiceRequests = async (...args: any[]) => ({ data: [], error: null });
export const getJobTeamsAndPositions = async (...args: any[]) => ({ data: { teams: [], positions: [] }, error: null });
export const updateJobTeam = async (...args: any[]) => ({ data: null, error: null });
export const updateJobPosition = async (...args: any[]) => ({ data: null, error: null });
export const listClientsWithStats = async (...args: any[]) => ({ data: [], error: null });

// Renaming for consistency: The list function for admin should use the correct table and column.
// The actual implementation is missing, but we fix the argument typing here.
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