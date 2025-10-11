// @ts-nocheck
import React, { useState, useEffect } from "react";
import { getServices } from "../../../../lib/supabase/operations";
import type { Database } from "../../../../lib/supabase/database.types";

type Service = Database['public']['Tables']['services']['Row'];

const ServicesTab = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      const { data } = await getServices();
      if (data) setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  if (loading) {
    return <div className="p-6">Loading services...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Services Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-white rounded-lg shadow p-4">
            {service.image_url && (
              <img
                src={service.image_url}
                alt={service.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{service.summary}</p>
            <span className={`inline-block px-2 py-1 text-xs rounded ${
              service.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {service.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;
