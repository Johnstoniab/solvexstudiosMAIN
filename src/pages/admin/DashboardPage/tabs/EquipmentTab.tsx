// FILE: src/pages/admin/DashboardPage/tabs/EquipmentTab.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { supabase } from '../../../../lib/supabase/client';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import Card from '../components/Card';
import { useToast } from '../../../../contexts/ToastContext';

type Equipment = {
  id: string;
  name: string;
  description: string | null;
  price_per_day: number;
  availability: string;
  image_url: string | null;
  created_at: string;
};

const EquipmentTab: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Equipment> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { addToast } = useToast();

  const fetchEquipment = async () => {
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      addToast({ type: 'error', title: 'Error', message: 'Could not fetch equipment.' });
    } else {
      setEquipment(data as Equipment[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchEquipment();
  }, []);

  const openModal = (item: Partial<Equipment> | null = null) => {
    setEditingItem(item || { name: '', description: '', price_per_day: 0, availability: 'Available' });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!editingItem) return;

    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!editingItem?.name) {
      addToast({ type: 'error', title: 'Validation Error', message: 'Name is required.' });
      return;
    }

    let imageUrl = editingItem.image_url || null;

    if (imageFile) {
      const filePath = `equipment/${Date.now()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('equipment_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        addToast({ type: 'error', title: 'Image Upload Failed', message: uploadError.message });
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('equipment_images').getPublicUrl(filePath);
      imageUrl = publicUrl;
    }

    const { id, ...itemData } = { ...editingItem, image_url: imageUrl };

    const { error } = id
      ? await supabase.from('equipment').update(itemData).eq('id', id)
      : await supabase.from('equipment').insert([itemData]);

    if (error) {
      addToast({ type: 'error', title: 'Save Failed', message: error.message });
    } else {
      addToast({ type: 'success', title: `Equipment ${id ? 'updated' : 'created'}!` });
      closeModal();
      fetchEquipment();
    }
  };

  const handleDelete = async (item: Equipment) => {
    if (!window.confirm(`Are you sure you want to delete "${item.name}"?`)) return;

    const { error } = await supabase.from('equipment').delete().eq('id', item.id);

    if (error) {
      addToast({ type: 'error', title: 'Delete Failed', message: error.message });
    } else {
      addToast({ type: 'success', title: 'Equipment deleted.' });
      fetchEquipment();
    }
  };

  const toggleAvailability = async (item: Equipment) => {
    const newAvailability = item.availability === 'Available' ? 'Unavailable' : 'Available';
    const { error } = await supabase
      .from('equipment')
      .update({ availability: newAvailability })
      .eq('id', item.id);
    
    if (error) {
        addToast({ type: 'error', title: 'Update failed', message: error.message });
    } else {
        addToast({ type: 'success', title: `"${item.name}" is now ${newAvailability}.` });
        fetchEquipment();
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
        <div className="space-y-3">
          {equipment.map((item) => (
            <div key={item.id} className="flex items-center bg-gray-50 p-3 rounded-lg border hover:shadow-md">
              <div className="flex-grow flex items-center gap-4">
                <img
                  src={item.image_url || 'https://via.placeholder.com/64'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md bg-gray-200"
                />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.availability === 'Available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.availability}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleAvailability(item)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-md" aria-label="Toggle Availability">
                  {item.availability === 'Available' ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button onClick={() => openModal(item)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-md" aria-label="Edit"><Edit size={16} /></button>
                <button onClick={() => handleDelete(item)} className="p-2 text-red-500 hover:bg-red-100 rounded-md" aria-label="Delete"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">{editingItem.id ? 'Edit Equipment' : 'Add New Equipment'}</h2>
            <div className="space-y-4">
              <input type="text" name="name" value={editingItem.name || ''} onChange={handleInputChange} placeholder="Item Name" className="w-full p-3 border rounded-md"/>
              <textarea name="description" value={editingItem.description || ''} onChange={handleInputChange} placeholder="Description" className="w-full p-3 border rounded-md h-24"/>
              <input type="number" step="0.01" name="price_per_day" value={editingItem.price_per_day || 0} onChange={handleInputChange} placeholder="Price per day" className="w-full p-3 border rounded-md"/>
              <select name="availability" value={editingItem.availability} onChange={handleInputChange} className="w-full p-3 border rounded-md">
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
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