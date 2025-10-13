// @ts-nocheck
// src/lib/supabase/operations.ts

import { supabase } from './client';
import type { Database } from './database.types';

export type RentalGear = Database['public']['Tables']['rental_gear']['Row'];
export type RentalGearInsert = Database['public']['Tables']['rental_gear']['Insert'];
export type RentalGearUpdate = Database['public']['Tables']['rental_gear']['Update'];

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

// --- RENTAL GEAR OPERATIONS ---

export const getRentalGear = async () => {
  return supabase
    .from('rental_gear')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });
};

export const createRentalGear = async (gear: RentalGearInsert) => {
  return supabase
    .from('rental_gear')
    .insert(gear)
    .select()
    .single();
};

export const updateRentalGear = async (id: string, updates: RentalGearUpdate) => {
  return supabase
    .from('rental_gear')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
};

export const deleteRentalGear = async (id: string) => {
  return supabase
    .from('rental_gear')
    .delete()
    .eq('id', id);
};

export const onRentalGearChange = (callback: (payload: any) => void) => {
  return supabase
    .channel('public:rental_gear')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rental_gear' }, callback)
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


// --- EXISTING OPERATIONS (Unchanged) ---

export const getRentalEquipment = async () => {
  return supabase
    .from('rental_equipment')
    .select('*')
    .order('category', { ascending: true });
};

export const updateRentalEquipment = async (id: string, updates: any) => {
  return supabase
    .from('rental_equipment')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
};

export const getOrCreateClientForUser = async (userId: string, email?: string, fullName?: string) => ({ data: null, error: null });
export const createServiceRequest = async (...args: any[]) => ({ data: null, error: null });
export const listMyServiceRequests = async (...args: any[]) => ({ data: [], error: null });
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