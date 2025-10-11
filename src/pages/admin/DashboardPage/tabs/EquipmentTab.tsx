// FILE: src/pages/admin/DashboardPage/tabs/EquipmentTab.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '../../../../lib/supabase/client';
import type { Database } from '../../../../lib/supabase/database.types';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Card from '../components/Card';
import { useToast } from '../../../../contexts/ToastContext';

type Rental = Database['public']['Tables']['rentals']['Row'];

const EquipmentTab: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRental, setEditingRental] = useState<Partial<Rental> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { addToast } = useToast();

  const fetchRentals = async () => {
    const { data, error } = await supabase
      .from('rentals')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      addToast({ type: 'error', title: 'Error', message: 'Could not fetch rental equipment.' });
    } else {
      setRentals(data as Rental[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchRentals();
  }, []);

  const openModal = (rental: Partial<Rental> | null = null) => {
    setEditingRental(rental || { name: '', category: '', price: 0, is_available: true });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRental(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (!editingRental) return;

    let finalValue: string | number | boolean = value;
    if (type === 'number') finalValue = parseFloat(value) || 0;
    if (type === 'checkbox') finalValue = (e.target as HTMLInputElement).checked;
    
    setEditingRental({ ...editingRental, [name]: finalValue });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!editingRental?.name || !editingRental.category) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Name and Category are required.' });
      return;
    }

    let image_path = editingRental.image_path || null;

    if (imageFile) {
      const filePath = `rentals/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('rental_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        addToast({ type: 'error', title: 'Image Upload Failed', message: uploadError.message });
        return;
      }
      image_path = filePath;
    }

    const { id, ...rentalData } = { ...editingRental, image_path };
    
    const { error } = id
      ? await supabase.from('rentals').update(rentalData).eq('id', id)
      : await supabase.from('rentals').insert([rentalData]);

    if (error) {
      addToast({ type: 'error', title: 'Save Failed', message: error.message });
    } else {
      addToast({ type: 'success', title: `Rental item ${id ? 'updated' : 'created'}!` });
      closeModal();
      fetchRentals();
    }
  };

  const handleDelete = async (rental: Rental) => {
    if (!window.confirm(`Are you sure you want to delete "${rental.name}"? This is permanent.`)) return;

    const { error } = await supabase.from('rentals').delete().eq('id', rental.id);

    if (error) {
      addToast({ type: 'error', title: 'Delete Failed', message: error.message });
    } else {
      if (rental.image_path) {
        await supabase.storage.from('rental_images').remove([rental.image_path]);
      }
      addToast({ type: 'success', title: 'Rental item deleted.' });
      fetchRentals();
    }
  };

  const toggleAvailability = async (rental: Rental) => {
    const { error } = await supabase
      .from('rentals')
      .update({ is_available: !rental.is_available })
      .eq('id', rental.id);
    
    if (error) {
        addToast({ type: 'error', title: 'Update failed', message: error.message });
    } else {
        addToast({ type: 'success', title: `"${rental.name}" is now ${!rental.is_available ? 'available' : 'unavailable'}.` });
        fetchRentals();
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(rentals);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRentals(items);

    const updates = items.map((item, index) => ({ id: item.id, order: index }));
    
    const { error } = await supabase.from('rentals').upsert(updates);
    if (error) {
      addToast({ type: 'error', title: 'Reorder Failed', message: error.message });
      fetchRentals(); 
    } else {
      addToast({ type: 'success', title: 'Equipment order saved!' });
    }
  };

  return (
    <Card title="Manage Rental Equipment" right={
      <button onClick={() => openModal()} className="flex items-center gap-2 bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#E64A19]">
        <Plus size={16} /> Add Equipment
      </button>
    }>
      {loading ? (
        <p>Loading equipment...</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="rentals-list">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                {rentals.map((item, index) => (
                  <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex items-center bg-gray-50 p-3 rounded-lg border hover:shadow-md">
                        <div className="flex-grow flex items-center gap-4">
                          <img
                            src={item.image_path ? `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/rental_images/${item.image_path}` : 'https://via.placeholder.com/64'}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md bg-gray-200"
                          />
                          <div>
                            <h3 className="font-bold">{item.name}</h3>
                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.is_available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.is_available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => toggleAvailability(item)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-md" aria-label="Toggle Availability">{item.is_available ? <Eye size={18} /> : <EyeOff size={18} />}</button>
                          <button onClick={() => openModal(item)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-md" aria-label="Edit"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(item)} className="p-2 text-red-500 hover:bg-red-100 rounded-md" aria-label="Delete"><Trash2 size={16} /></button>
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

      {isModalOpen && editingRental && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">{editingRental.id ? 'Edit Equipment' : 'Add New Equipment'}</h2>
            <div className="space-y-4">
              <input type="text" name="name" value={editingRental.name || ''} onChange={handleInputChange} placeholder="Item Name" className="w-full p-3 border rounded-md"/>
              <input type="text" name="category" value={editingRental.category || ''} onChange={handleInputChange} placeholder="Category (e.g., Camera, Lighting)" className="w-full p-3 border rounded-md"/>
              <textarea name="description" value={editingRental.description || ''} onChange={handleInputChange} placeholder="Description" className="w-full p-3 border rounded-md h-24"/>
              <input type="number" step="0.01" name="price" value={editingRental.price} onChange={handleInputChange} placeholder="Price per day" className="w-full p-3 border rounded-md"/>
              <div className="flex items-center gap-2">
                 <input type="checkbox" name="is_available" checked={editingRental.is_available} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                 <label htmlFor="is_available" className="text-sm font-medium text-gray-700">Available for rent</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Equipment Image</label>
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

export default EquipmentTab;