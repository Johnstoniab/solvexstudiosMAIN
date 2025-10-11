import React, { useState, useEffect, useCallback } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { getServices, updateService, uploadServiceImage } from "../../../../lib/supabase/operations";
import type { Database } from "../../../../lib/supabase/database.types";
import ServiceCard from "../../../../components/admin/Services/ServiceCard";

type Service = Database['public']['Tables']['services']['Row'];

const ServicesTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await getServices();
    if (fetchError) {
      setError("Failed to fetch services.");
      console.error(fetchError);
    } else {
      setServices(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdate = async (id: string, updates: Partial<Service>) => {
    const { data, error: updateError } = await updateService(id, updates);
    if (updateError) {
      setError("Failed to save changes.");
    } else if (data) {
      setServices(prev => prev.map(s => s.id === id ? data : s));
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    const { publicUrl, error: uploadError } = await uploadServiceImage(file);
    if (uploadError) {
      setError("Failed to upload image.");
    } else if (publicUrl) {
      await handleUpdate(id, { image_url: publicUrl });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-gray-400" /></div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600 flex flex-col items-center gap-3"><AlertCircle className="w-6 h-6" />{error}</div>;
  }

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-gray-800">Manage Public Services</h1>
       <p className="text-sm text-gray-500 -mt-4">
         Edit the content for each service card. Changes are saved automatically and will update the public website.
       </p>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <ServiceCard 
            key={service.id} 
            service={service}
            onUpdate={handleUpdate}
            onImageUpload={handleImageUpload}
          />
        ))}
       </div>
    </div>
  );
};

export default ServicesTab;