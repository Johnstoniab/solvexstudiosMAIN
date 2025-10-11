// FILE: src/pages/ServicesPage.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/client';
import type { Database } from '../lib/supabase/database.types';

type Service = Database['public']['Tables']['services']['Row'];

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'published')
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
      } else {
        setServices(data);
      }
      setLoading(false);
    };

    fetchServices();

    const channel = supabase
      .channel('public:services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, (payload) => {
        fetchServices();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-extrabold text-center mb-12">Our Services</h1>
      {loading ? (
        <p className="text-center">Loading live services...</p>
      ) : services.length === 0 ? (
        <p className="text-center text-gray-500">No services are available at the moment. Please check back later!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              {service.image_path && (
                <img
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/service_images/${service.image_path}`}
                  alt={service.title}
                  className="w-full h-56 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-right text-xl font-semibold">
                  ${service.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;