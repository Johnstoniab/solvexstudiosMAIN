// @ts-nocheck
import { supabase } from './client';
import type { Database } from './database.types';

export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateService = async (id: string, updates: any) => {
  try {
    // @ts-ignore
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const uploadServiceImage = async (file: File) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('service_images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('service_images')
            .getPublicUrl(filePath);

        return { publicUrl: data.publicUrl, error: null };
    } catch (error) {
        return { publicUrl: null, error };
    }
};

export const listClientsWithStats = async () => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*');
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const listServiceRequests = async () => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*');
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateServiceRequestStatus = async (id: string, status: string) => {
  try {
    // @ts-ignore
    const { data, error } = await supabase
      .from('requests')
      .update({ status } as any)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export type ServiceRequestStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export const getOrCreateClientForUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createServiceRequest = async (request: any) => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .insert(request)
      .select()
      .maybeSingle();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const listMyServiceRequests = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select('*')
      .eq('client_id', userId);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getCareerApplications = async () => {
  try {
    const { data, error } = await supabase
      .from('career_applications')
      .select('*');
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateCareerApplicationStatus = async (id: string, status: string) => {
  try {
    // @ts-ignore
    const { data, error } = await supabase
      .from('career_applications')
      .update({ status } as any)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const createMember = async (member: any) => {
  try {
    const { data, error } = await supabase
      .from('members')
      .insert(member)
      .select()
      .maybeSingle();
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getTeams = async () => {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*');
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const getMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*');
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};