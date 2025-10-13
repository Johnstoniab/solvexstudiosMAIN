// @ts-nocheck
// src/lib/supabase/operations.ts

import { supabase } from './client';
import type { Database } from './database.types';

// Define the shape of data the public frontend expects
export type RentalItemDisplay = {
  id: string;
  title: string;          // Mapped from 'name'
  subtitle: string | null; // Mapped from 'description'
  category: string;
  price: number;          // Mapped from 'price_per_day'
  images: string[] | null; // Mapped from 'image_url' (converted to array)
  features: string[] | null; // Placeholder
  videoUrl: string | null; // Placeholder
  status: 'Available' | 'Unavailable' | 'Retired'; // Mapped from 'is_available'
};

// Original table types (for internal Admin use)
export type RentalGear = Database['public']['Tables']['rental_gear']['Row'];
export type RentalGearInsert = Database['public']['Tables']['rental_gear']['Insert'];
export type RentalGearUpdate = Database['public']['Tables']['rental_gear']['Update'];
export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

// --- RENTAL EQUIPMENT OPERATIONS ---

// FIX: Queries 'rental_gear' and maps column names to frontend expectations
export const getRentalEquipment = async () => {
  const { data, error } = await supabase
    .from('rental_gear')
    .select(`
      id,
      name,           
      description,
      category,
      price_per_day,
      image_url,
      is_available,
      video_url,
      features
    `)
    .eq('is_available', true) // Only fetch available items for public view
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) return { data: [], error };

  // Manually map to the expected frontend format
  const mappedData = data.map(item => ({
    id: item.id,
    title: item.name,                      // name -> title
    subtitle: item.description,            // description -> subtitle
    category: item.category,
    price: item.price_per_day,             // price_per_day -> price
    images: item.image_url ? [item.image_url] : [''], 
    features: Array.isArray(item.features) ? item.features : [], 
    videoUrl: item.video_url,              // Corrected field name
    status: item.is_available ? 'Available' : 'Unavailable', 
  }));
  
  return { data: mappedData as RentalItemDisplay[], error: null };
};

// Fetches ALL equipment for the admin dashboard
export const getAllRentalEquipment = async () => {
  return supabase.from('rental_gear').select('*');
};


// Updates a piece of rental equipment
export const updateRentalEquipment = async (id: string, updates: Partial<RentalGear>) => {
  return supabase.from('rental_gear').update(updates).eq('id', id);
};

// Deletes a piece of rental equipment
export const deleteRentalEquipment = async (id: string) => {
  return supabase.from('rental_gear').delete().eq('id', id);
};

// Subscribes to real-time changes on the rental_gear table
export const onRentalGearChange = (callback: () => void) => {
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