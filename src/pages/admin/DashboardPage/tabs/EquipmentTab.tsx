import React, { useState, useEffect, useCallback } from "react";
import { Loader as Loader2, CircleCheck as CheckCircle } from "lucide-react";
import Card from "../components/Card";
import { getRentalEquipment, updateRentalEquipment } from "../../../../lib/supabase/operations";
import type { Database } from "../../../../lib/supabase/database.types";

type Equipment = Database['public']['Tables']['rental_equipment']['Row'];
type EquipmentStatus = Equipment['status'];

const EquipmentTab: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await getRentalEquipment();
    if (fetchError) {
      setError("Failed to load equipment.");
      console.error(fetchError);
    } else {
      setEquipment(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);


  const handleUpdate = async (id: string, updates: Partial<Equipment>) => {
    const originalEquipment = [...equipment];
    
    // Optimistic UI update
    setEquipment(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));

    const { error: updateError } = await updateRentalEquipment(id, updates);

    if (updateError) {
      setError("Failed to save changes. Please refresh and try again.");
      setEquipment(originalEquipment); // Revert on failure
    }
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      handleUpdate(id, { price: currentPrice });
      setEditingPriceId(null);
    } else if (e.key === 'Escape') {
      setEditingPriceId(null);
    }
  };
  
  const handlePriceBlur = (id: string) => {
    handleUpdate(id, { price: currentPrice });
    setEditingPriceId(null);
  };

  const statusOptions: EquipmentStatus[] = ['Available', 'Maintenance', 'Retired'];
  const statusColors: Record<EquipmentStatus, string> = {
    Available: 'bg-green-100 text-green-800 ring-green-200',
    Maintenance: 'bg-amber-100 text-amber-800 ring-amber-200',
    Retired: 'bg-red-100 text-red-800 ring-red-200',
  };

  return (
    <div className="space-y-6">
      <Card title="Equipment Inventory & Management">
        {loading ? (
          <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-6 py-3 font-semibold">Item</th>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold text-center">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Price/Day (GHS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {equipment.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={item.images?.[0]} alt={item.title} className="w-12 h-12 object-contain rounded-md bg-gray-100 p-1" />
                        <span className="font-medium text-gray-800">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{item.category}</td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdate(item.id, { status: e.target.value as EquipmentStatus })}
                        className={`w-32 border-none rounded-full px-2.5 py-0.5 text-xs font-semibold appearance-none text-center ring-1 ring-inset focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${statusColors[item.status]}`}
                      >
                        {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingPriceId === item.id ? (
                        <input
                          type="number"
                          value={currentPrice}
                          onChange={(e) => setCurrentPrice(Number(e.target.value))}
                          onKeyDown={(e) => handlePriceKeyDown(e, item.id)}
                          onBlur={() => handlePriceBlur(item.id)}
                          autoFocus
                          className="w-24 text-right bg-white border border-blue-400 rounded-md px-2 py-1 shadow-inner"
                        />
                      ) : (
                        <div
                          onClick={() => { setEditingPriceId(item.id); setCurrentPrice(item.price); }}
                          className="cursor-pointer font-semibold text-gray-800 p-1 rounded-md hover:bg-gray-200"
                        >
                          {item.price.toFixed(2)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EquipmentTab;