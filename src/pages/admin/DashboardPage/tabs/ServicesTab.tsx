import React, { useState } from 'react';
import Card from '../components/Card';
import { Info, Plus, Edit, Trash2, Send } from 'lucide-react';

// --- We are now importing your services directly from your project files ---
import { businessServicesData } from '../../../../data/business/services.data';

const ServicesTab: React.FC = () => {
  // --- The admin panel now uses the manually imported data ---
  const [services] = useState(businessServicesData.map(s => ({
    id: s.title,
    title: s.title,
    summary: s.summary,
    imageUrl: s.imageUrl,
    status: 'manual', // A simple status to show it's not live
  })));

  return (
    <Card title="Manage Services (Manual Mode)" right={
      <button className="flex items-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed">
        <Plus size={16} /> Add New (Disabled)
      </button>
    }>
      <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
        <div className="flex">
          <div className="py-1"><Info className="h-5 w-5 mr-3" /></div>
          <div>
            <p className="font-bold">Manual Mode Enabled</p>
            <p className="text-sm">This tab is showing services from the local project files, not from the live database. All editing, publishing, and deleting functions are temporarily disabled.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {services.map(service => (
          <div key={service.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border">
            <div className="flex items-center gap-4">
              <img src={service.imageUrl || 'https://via.placeholder.com/150'} alt={service.title} className="w-16 h-16 object-cover rounded-md bg-gray-200" />
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="font-bold text-gray-800">{service.title}</h4>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">
                    Manual
                  </span>
                </div>
                <p className="text-xs text-gray-600 max-w-md mt-1">{service.summary}</p>
              </div>
            </div>
            <div className="flex gap-2">
                <button className="p-2 rounded-md text-gray-400 bg-gray-200 cursor-not-allowed" disabled><Send size={16} /></button>
                <button className="p-2 text-gray-400 bg-gray-200 cursor-not-allowed" disabled><Edit size={16} /></button>
                <button className="p-2 text-gray-400 bg-gray-200 cursor-not-allowed" disabled><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ServicesTab;