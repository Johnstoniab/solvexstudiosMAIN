import React, { useState, useEffect, useCallback } from "react";
import { Loader2, Plus, Search, Pencil, Trash2, X, Check } from "lucide-react";
import Card from "../components/Card";
import {
  getRentalGear,
  createRentalGear,
  updateRentalGear,
  deleteRentalGear,
  onRentalGearChange
} from "../../../../lib/supabase/operations";
import type { RentalGear, RentalGearInsert, RentalGearUpdate } from "../../../../lib/supabase/operations";

const EquipmentTab: React.FC = () => {
  const [equipment, setEquipment] = useState<RentalGear[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<RentalGear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<RentalGear | null>(null);

  const [formData, setFormData] = useState<RentalGearInsert>({
    name: "",
    description: "",
    category: "",
    price_per_day: 0,
    is_available: true,
    image_url: ""
  });

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await getRentalGear();
    if (fetchError) {
      setError("Failed to load equipment.");
      console.error(fetchError);
    } else {
      setEquipment(data || []);
      setFilteredEquipment(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEquipment();

    const channel = onRentalGearChange((payload) => {
      console.log('Real-time update:', payload);
      fetchEquipment();
    });

    return () => {
      channel.unsubscribe();
    };
  }, [fetchEquipment]);

  useEffect(() => {
    let filtered = equipment;

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredEquipment(filtered);
  }, [searchTerm, selectedCategory, equipment]);

  const categories = ["all", ...Array.from(new Set(equipment.map(e => e.category).filter(Boolean)))];

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleToggleAvailability = async (item: RentalGear) => {
    const updates: RentalGearUpdate = { is_available: !item.is_available };
    const { error: updateError } = await updateRentalGear(item.id, updates);

    if (updateError) {
      setError("Failed to update availability.");
      console.error(updateError);
    } else {
      showSuccess(`${item.name} marked as ${!item.is_available ? 'available' : 'unavailable'}`);
    }
  };

  const handleUpdatePrice = async (item: RentalGear, newPrice: number) => {
    if (newPrice < 0) {
      setError("Price must be a positive number");
      return;
    }

    const updates: RentalGearUpdate = { price_per_day: newPrice };
    const { error: updateError } = await updateRentalGear(item.id, updates);

    if (updateError) {
      setError("Failed to update price.");
      console.error(updateError);
    } else {
      showSuccess(`Price updated for ${item.name}`);
    }
  };

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.price_per_day <= 0) {
      setError("Please provide valid equipment name and price");
      return;
    }

    const { error: createError } = await createRentalGear(formData);

    if (createError) {
      setError("Failed to add equipment.");
      console.error(createError);
    } else {
      showSuccess("Equipment added successfully");
      setIsAddModalOpen(false);
      resetForm();
    }
  };

  const handleEditEquipment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentItem) return;

    const updates: RentalGearUpdate = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      price_per_day: formData.price_per_day,
      image_url: formData.image_url
    };

    const { error: updateError } = await updateRentalGear(currentItem.id, updates);

    if (updateError) {
      setError("Failed to update equipment.");
      console.error(updateError);
    } else {
      showSuccess("Equipment updated successfully");
      setIsEditModalOpen(false);
      setCurrentItem(null);
      resetForm();
    }
  };

  const handleDeleteEquipment = async (item: RentalGear) => {
    if (!confirm(`Are you sure you want to delete ${item.name}?`)) return;

    const { error: deleteError } = await deleteRentalGear(item.id);

    if (deleteError) {
      setError("Failed to delete equipment.");
      console.error(deleteError);
    } else {
      showSuccess("Equipment deleted successfully");
    }
  };

  const openEditModal = (item: RentalGear) => {
    setCurrentItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      category: item.category || "",
      price_per_day: item.price_per_day,
      is_available: item.is_available,
      image_url: item.image_url || ""
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      price_per_day: 0,
      is_available: true,
      image_url: ""
    });
    setError(null);
  };

  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setCurrentItem(null);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <Card title="Rental Gear Management">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Equipment
            </button>
          </div>

          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              <Check className="w-5 h-5" />
              {successMessage}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              <X className="w-5 h-5" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm || selectedCategory !== "all"
                ? "No equipment found matching your filters"
                : "No equipment added yet"}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left text-gray-600">
                    <th className="px-6 py-3 font-semibold">Equipment</th>
                    <th className="px-6 py-3 font-semibold">Category</th>
                    <th className="px-6 py-3 font-semibold text-center">Availability</th>
                    <th className="px-6 py-3 font-semibold text-right">Price/Day</th>
                    <th className="px-6 py-3 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredEquipment.map(item => (
                    <EquipmentRow
                      key={item.id}
                      item={item}
                      onToggleAvailability={handleToggleAvailability}
                      onUpdatePrice={handleUpdatePrice}
                      onEdit={openEditModal}
                      onDelete={handleDeleteEquipment}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {isAddModalOpen && (
        <EquipmentModal
          title="Add New Equipment"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddEquipment}
          onClose={closeModals}
        />
      )}

      {isEditModalOpen && currentItem && (
        <EquipmentModal
          title="Edit Equipment"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditEquipment}
          onClose={closeModals}
        />
      )}
    </div>
  );
};

interface EquipmentRowProps {
  item: RentalGear;
  onToggleAvailability: (item: RentalGear) => void;
  onUpdatePrice: (item: RentalGear, price: number) => void;
  onEdit: (item: RentalGear) => void;
  onDelete: (item: RentalGear) => void;
}

const EquipmentRow: React.FC<EquipmentRowProps> = ({
  item,
  onToggleAvailability,
  onUpdatePrice,
  onEdit,
  onDelete
}) => {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(item.price_per_day);

  const handlePriceSave = () => {
    if (tempPrice !== item.price_per_day) {
      onUpdatePrice(item, tempPrice);
    }
    setIsEditingPrice(false);
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePriceSave();
    } else if (e.key === 'Escape') {
      setTempPrice(item.price_per_day);
      setIsEditingPrice(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-lg bg-gray-100"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
              No image
            </div>
          )}
          <div>
            <div className="font-medium text-gray-800">{item.name}</div>
            {item.description && (
              <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                {item.description}
              </div>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-gray-600">
        {item.category || "-"}
      </td>

      <td className="px-6 py-4 text-center">
        <button
          onClick={() => onToggleAvailability(item)}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            item.is_available
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-red-100 text-red-800 hover:bg-red-200"
          }`}
        >
          {item.is_available ? "Available" : "Unavailable"}
        </button>
      </td>

      <td className="px-6 py-4 text-right">
        {isEditingPrice ? (
          <input
            type="number"
            step="0.01"
            min="0"
            value={tempPrice}
            onChange={(e) => setTempPrice(Number(e.target.value))}
            onKeyDown={handlePriceKeyDown}
            onBlur={handlePriceSave}
            autoFocus
            className="w-24 text-right bg-white border border-blue-400 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div
            onClick={() => {
              setIsEditingPrice(true);
              setTempPrice(item.price_per_day);
            }}
            className="cursor-pointer font-semibold text-gray-800 inline-block px-2 py-1 rounded hover:bg-gray-200 transition-colors"
          >
            GHS {Number(item.price_per_day).toFixed(2)}
          </div>
        )}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

interface EquipmentModalProps {
  title: string;
  formData: RentalGearInsert;
  setFormData: React.Dispatch<React.SetStateAction<RentalGearInsert>>;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const EquipmentModal: React.FC<EquipmentModalProps> = ({
  title,
  formData,
  setFormData,
  onSubmit,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Sony A7 III Camera"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Detailed description of the equipment..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Camera, Lighting"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Day (GHS) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price_per_day}
                onChange={(e) => setFormData({ ...formData, price_per_day: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formData.image_url || ""}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_available"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
              Available for rent
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Equipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EquipmentTab;
