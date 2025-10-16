// @ts-nocheck
// src/lib/supabase/operations.ts

import { supabase } from './client';
import type { Database } from './database.types';

// Define the shape of data the public frontend expects
export type RentalItemDisplay = {
  id: string;
  title: string;          // Mapped from 'name'
  subtitle: string | null; // Mapped from 'description'
  category: string | null; // Added nullable from DB type
  price: number;          // Mapped from 'price_per_day'
  images: string[] | null; // Mapped from 'image_url' (converted to array)
  features: string[] | null; // Mapped from 'features' column
  videoUrl: string | null; // Mapped from 'video_url' column
  status: 'Available' | 'Unavailable' | 'Retired'; // Mapped from 'is_available'
};

// Original table types (for internal Admin use)
// Using 'rental_gear' which is the correct table name from the migration
export type RentalGear = Database['public']['Tables']['rental_gear']['Row'];
export type RentalGearInsert = Database['public']['Tables']['rental_gear']['Insert'];
export type RentalGearUpdate = Database['public']['Tables']['rental_gear']['Update'];
export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

// --- RENTAL EQUIPMENT OPERATIONS (Connected to live data) ---

/**
 * Fetches only available rental items and maps them to the public display format.
 */
export const getRentalEquipment = async () => {
  const { data, error } = await supabase
    .from('rental_gear')
    .select(`
      id,
      name,           
      description,
      category,
      price_per_day,
      is_available,
      image_url,
      video_url,
      features
    `)
    .eq('is_available', true) // Only fetch available items for public view
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) return { data: [], error };

  // Manually map to the expected frontend format (RentalItemDisplay)
  const mappedData = data.map(item => ({
    id: item.id,
    title: item.name,                      // name -> title
    subtitle: item.description,            // description -> subtitle
    category: item.category,
    price: item.price_per_day,             // price_per_day -> price
    // Assuming image_url can be a single string from DB but frontend expects an array
    images: item.image_url ? [item.image_url] : [''], 
    // Ensure features are treated as string array
    features: Array.isArray(item.features) ? item.features : (item.features ? [item.features] : []), 
    videoUrl: item.video_url,              
    status: item.is_available ? 'Available' : 'Unavailable', 
  }));
  
  return { data: mappedData, error: null };
};

// Fetches ALL equipment for the admin dashboard
export const getAllRentalEquipment = async () => {
  return supabase.from('rental_gear').select('*');
};


// Updates a piece of rental equipment
export const updateRentalEquipment = async (id: string, updates: Partial<RentalGearUpdate>) => {
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


// --- REAL-TIME SERVICE OPERATIONS (Connected to live data) ---

// Get all active (not deleted) services for Admin view
export const getServices = async () => supabase.from('services').select('*').eq('is_deleted', false).order('title', { ascending: true });

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


// --- CLIENT/ADMIN REQUEST OPERATIONS (Implementing existing stubs) ---

// Assuming getOrCreateClientForUser logic is now in AuthProvider
export const getOrCreateClientForUser = async (userId: string, email?: string, fullName?: string) => {
    // Implementation is in AuthProvider, keeping a basic fallback here for explicit calls
    if (!userId) return { data: null, error: null };
    const upsertData = {
        id: userId,
        full_name: fullName,
        email: email,
        tier: 'Regular',
        is_active: true,
    };
    const { error: upsertError } = await supabase
        .from('clients')
        .upsert(upsertData, { onConflict: 'id' });
    if (upsertError) return { data: null, error: upsertError };
    const { data: clientData, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', userId)
        .single();
    if (fetchError) return { data: null, error: fetchError };
    return { data: clientData, error: null };
};

// Implemented: Create Service Request (Used by ClientDashboard)
export const createServiceRequest = async (payload: Database['public']['Tables']['service_requests']['Insert']) => {
  const { data, error } = await supabase
    .from('service_requests')
    .insert([payload])
    .select()
    .single();

  if (error) return { data: null, error };
  return { data, error: null };
};

// Implemented: List My Service Requests (Used by ClientDashboard)
export const listMyServiceRequests = async (clientId: string) => {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`*, clients (full_name, email)`) // Join to client table
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) return { data: [], error };
  return { data, error: null };
};

// --- ADMIN DASHBOARD OPERATIONS (Implementing existing stubs) ---

export const listClientsWithStats = async (...args: any[]) => ({ data: [], error: null });

// Implemented: List all requests for Admin view (Used by ClientsTab)
export const listServiceRequests = async () => {
  const { data, error } = await supabase
    .from('service_requests')
    .select(`*, clients (full_name, email)`) // Fetch client details for display
    .order('requested_at', { ascending: false });

  if (error) return { data: [], error };
  return { data, error: null };
};

// Implemented: Update request status (Used by ClientsTab)
export const updateServiceRequestStatus = async (id: string, newStatus: ServiceRequestStatus) => {
  return supabase.from('service_requests').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id);
};

export const getJobTeamsAndPositions = async (...args: any[]) => ({ data: { teams: [], positions: [] }, error: null });
export const updateJobTeam = async (...args: any[]) => ({ data: null, error: null });
export const updateJobPosition = async (...args: any[]) => ({ data: null, error: null });
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