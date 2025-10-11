import React, { useState, useRef } from 'react';
import { Edit, Save, X, UploadCloud } from 'lucide-react';
import type { Database } from '../../../lib/supabase/database.types';

type Service = Database['public']['Tables']['services']['Row'];

interface ServiceCardProps {
  service: Service;
  onUpdate: (id: string, updates: Partial<Service>) => Promise<void>;
  onImageUpload: (id: string, file: File) => Promise<void>;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onUpdate, onImageUpload }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedService, setEditedService] = useState(service);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    // Convert comma-separated string back to array for sub_services
    const updates = {
        ...editedService,
        sub_services: typeof editedService.sub_services === 'string' 
            ? (editedService.sub_services as string).split(',').map(s => s.trim()) 
            : editedService.sub_services,
    };
    await onUpdate(service.id, updates);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditedService({ ...editedService, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(service.id, file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border overflow-hidden transition-all">
      <div className="relative">
        <img src={editedService.image_url || 'https://placehold.co/600x400/eee/ccc?text=No+Image'} alt={editedService.title} className="w-full h-48 object-cover" />
        {isEditing && (
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md hover:bg-black/70 flex items-center gap-1">
                <UploadCloud size={14} /> Change Image
            </button>
        )}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      </div>
      <div className="p-4 space-y-2">
        {isEditing ? (
          <>
            <input name="title" value={editedService.title} onChange={handleChange} className="w-full p-1 border rounded-md text-lg font-bold" />
            <textarea name="summary" value={editedService.summary || ''} onChange={handleChange} rows={3} className="w-full p-1 border rounded-md text-sm text-gray-600" />
            <textarea name="description" placeholder="Detailed Description" value={editedService.description || ''} onChange={handleChange} rows={5} className="w-full p-1 border rounded-md text-sm" />
            <textarea name="sub_services" placeholder="Sub-services (comma-separated)" value={(editedService.sub_services || []).join(', ')} onChange={handleChange} rows={3} className="w-full p-1 border rounded-md text-sm" />
            <textarea name="outcome" placeholder="Outcome" value={editedService.outcome || ''} onChange={handleChange} rows={2} className="w-full p-1 border rounded-md text-sm" />
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold">{service.title}</h3>
            <p className="text-sm text-gray-600 h-16 overflow-hidden">{service.summary}</p>
          </>
        )}
      </div>
      <div className="px-4 py-2 bg-gray-50 border-t flex justify-end gap-2">
        {isEditing ? (
          <>
            <button onClick={() => setIsEditing(false)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"><X size={16} /></button>
            <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-100 rounded-full"><Save size={16} /></button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full"><Edit size={16} /></button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;