// FILE: src/pages/admin/DashboardPage/tabs/ServicesTab.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '../../../../lib/supabase/client';
import type { Database } from '../../../../lib/supabase/database.types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Card from '../components/Card';
import { useToast } from '../../../../contexts/ToastContext';

type Service = Database['public']['Tables']['services']['Row'];

const ServicesTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { addToast } = useToast();

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      addToast({ type: 'error', title: 'Error', message: 'Could not fetch services.' });
    } else {
      setServices(data as Service[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchServices();
  }, []);

  const openModal = (service: Partial<Service> | null = null) => {
    setEditingService(service || { title: '', slug: '', price: 0, status: 'draft' });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!editingService) return;

    let finalValue: string | number = value;
    if (name === 'price') finalValue = parseFloat(value) || 0;
    
    const updatedService = { ...editingService, [name]: finalValue };

    if (name === 'title' && !editingService.id) {
      updatedService.slug = value.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    
    setEditingService(updatedService);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!editingService?.title || !editingService.slug) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Title and Slug are required.' });
      return;
    }

    let image_path = editingService.image_path || null;

    if (imageFile) {
      const filePath = `${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('service_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        addToast({ type: 'error', title: 'Image Upload Failed', message: uploadError.message });
        return;
      }
      image_path = filePath;
    }

    const { id, ...serviceData } = { ...editingService, image_path };
    
    let error;
    if (id) {
      ({ error } = await supabase.from('services').update(serviceData).eq('id', id));
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      ({ error } = await supabase.from('services').insert([{ ...serviceData, created_by: user?.id }]));
    }

    if (error) {
      addToast({ type: 'error', title: 'Save Failed', message: error.message });
    } else {
      addToast({ type: 'success', title: `Service ${id ? 'updated' : 'created'} successfully!` });
      closeModal();
      fetchServices();
    }
  };

  const handleDelete = async (service: Service) => {
    if (!window.confirm(`Are you sure you want to delete "${service.title}"? This cannot be undone.`)) return;

    const { error } = await supabase.from('services').delete().eq('id', service.id);

    if (error) {
      addToast({ type: 'error', title: 'Delete Failed', message: error.message });
    } else {
      if (service.image_path) {
        await supabase.storage.from('service_images').remove([service.image_path]);
      }
      addToast({ type: 'success', title: 'Service deleted.' });
      fetchServices();
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(services);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setServices(items);

    const updates = items.map((service, index) => ({ id: service.id, order: index }));
    
    const { error } = await supabase.from('services').upsert(updates);
    if (error) {
      addToast({ type: 'error', title: 'Reorder Failed', message: error.message });
      fetchServices(); 
    } else {
      addToast({ type: 'success', title: 'Service order saved!' });
    }
  };

  return (
    <Card title="Manage Services" right={
      <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#E64A19]">
        <Plus size={16} /> Add New Service
      </button>
    }>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="services-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {services.map((service, index) => (
                  <Draggable key={service.id} draggableId={String(service.id)} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex items-center bg-gray-50 p-3 rounded-lg border hover:shadow-md">
                        <div className="flex-grow flex items-center gap-4">
                          <img
                            src={service.image_path ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/service_images/${service.image_path}` : 'https://via.placeholder.com/64'}
                            alt={service.title}
                            className="w-16 h-16 object-cover rounded-md bg-gray-200"
                          />
                          <div>
                            <h3 className="font-bold text-lg">{service.title}</h3>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${service.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {service.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openModal(service)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-md" aria-label="Edit"><Edit size={18} /></button>
                          <button onClick={() => handleDelete(service)} className="p-2 text-red-600 hover:bg-red-100 rounded-md" aria-label="Delete"><Trash2 size={18} /></button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {isModalOpen && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">{editingService.id ? 'Edit Service' : 'Add New Service'}</h2>
            <div className="space-y-4">
              <input type="text" name="title" value={editingService.title} onChange={handleInputChange} placeholder="Service Title" className="w-full p-3 border rounded-md"/>
              <input type="text" name="slug" value={editingService.slug} onChange={handleInputChange} placeholder="URL Slug (auto-generated)" className={`w-full p-3 border rounded-md ${editingService.id ? 'bg-gray-100' : ''}`} readOnly={!!editingService.id} />
              <textarea name="description" value={editingService.description || ''} onChange={handleInputChange} placeholder="Description" className="w-full p-3 border rounded-md h-24"/>
              <input type="number" step="0.01" name="price" value={editingService.price} onChange={handleInputChange} placeholder="Price" className="w-full p-3 border rounded-md"/>
              <select name="status" value={editingService.status} onChange={handleInputChange} className="w-full p-3 border rounded-md">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Image</label>
                <input type="file" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1"/>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={closeModal} className="px-4 py-2 rounded-md hover:bg-gray-100">Cancel</button>
              <button onClick={handleSave} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ServicesTab;