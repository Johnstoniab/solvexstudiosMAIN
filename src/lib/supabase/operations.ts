// This file is also long. Add these new functions anywhere inside it.

// --- ADD THESE NEW SERVICE FUNCTIONS ---
export const getServices = async () => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

export const updateService = async (id: string, updates: Partial<Database['public']['Tables']['services']['Update']>) => {
  try {
    const { data, error } = await supabase
      .from('services')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
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
// --- END OF ADDITION ---