// @ts-nocheck
// src/pages/admin/DashboardPage/tabs/EquipmentTab.tsx

import React, { useState, useEffect, useCallback } from "react";
import Card from "../components/Card";
import { RefreshCw, Database, CircleAlert as AlertCircle, Loader2, Edit, Trash2 } from "lucide-react";
import { supabase } from "../../../../lib/supabase/client";
import { 
  getAllRentalEquipment, 
  onRentalGearChange, 
  updateRentalEquipment, 
  deleteRentalEquipment,
  RentalGear
} from "../../../../lib/supabase/operations"; 
import { useToast } from "../../../../contexts/ToastContext";


const EquipmentTab: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<RentalGear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { addToast } = useToast();

  const fetchData = useCallback(async () => {
    setError(null);
    const { data, error: fetchError } = await getAllRentalEquipment();
    if (fetchError) {
      setError("Failed to fetch equipment data.");
      console.error(fetchError);
    } else {
      setEquipmentList(data || []);
    }
    setLoading(false);
  }, []);

  // Initial fetch and Realtime Subscription
  useEffect(() => {
    fetchData();
    
    // Subscribe to live changes for immediate updates (FIXES "NOT LIVE")
    const channel = onRentalGearChange(() => {
      // Re-fetch data on any change
      fetchData(); 
    });

    return () => {
      // Clean up subscription on unmount
      supabase.removeChannel(channel);
    };
  }, [fetchData]);
  
  // Handlers for Admin actions
  const handleToggleAvailability = async (item: RentalGear) => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    // Optimistic update
    const newAvailability = !item.is_available;
    setEquipmentList(prev => prev.map(e => e.id === item.id ? { ...e, is_available: newAvailability } : e));
    
    // FIX: Calls the updated operation function
    const { error: updateError } = await updateRentalEquipment(item.id, { is_available: newAvailability });
    
    if (updateError) {
      // FIX: The general 'failed to update' issue is often RLS. Running the sync button below will re-apply RLS.
      addToast({ type: 'error', title: 'Update Failed', message: `Failed to update: ${updateError.message}. Did you run the database sync in Settings?` });
      // Revert on failure
      setEquipmentList(prev => prev.map(e => e.id === item.id ? { ...e, is_available: item.is_available } : e));
    } else {
      addToast({ type: 'success', title: 'Status Updated', message: `${item.name} is now ${newAvailability ? 'Available' : 'Unavailable'}.` });
    }
    setIsUpdating(false);
  };
  
  const handleDelete = async (item: RentalGear) => {
      if (!window.confirm(`Are you sure you want to delete ${item.name}? This action is irreversible.`)) return;
      
      const originalList = equipmentList;
      setEquipmentList(prev => prev.filter(e => e.id !== item.id)); // Optimistic delete
      
      const { error: deleteError } = await deleteRentalEquipment(item.id);
      
      if (deleteError) {
        addToast({ type: 'error', title: 'Delete Failed', message: deleteError.message });
        setEquipmentList(originalList); // Revert
      } else {
        addToast({ type: 'success', title: 'Item Deleted', message: `${item.name} has been removed.` });
      }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="space-y-6">
      <Card title={`Rental Gear Inventory (${equipmentList.length})`} right={
        <button onClick={fetchData} disabled={loading} className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50" title="Refresh">
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      }>
        {error && <div className="text-center py-20 text-red-600 flex flex-col items-center gap-3"><AlertCircle className="w-6 h-6" />{error}</div>}
        
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold">Category</th>
                <th className="px-4 py-2 font-semibold">Price/Day</th>
                <th className="px-4 py-2 font-semibold text-center">Status</th>
                <th className="px-4 py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {equipmentList.map((item) => {
                const isAvailable = item.is_available;
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.category}</td>
                    <td className="px-4 py-3 text-gray-600">GHS {item.price_per_day ? item.price_per_day.toFixed(2) : 'N/A'}</td> 
                    <td className="px-4 py-3 text-center">
                        <button
                            onClick={() => handleToggleAvailability(item)}
                            disabled={isUpdating}
                            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset transition-colors ${
                              isAvailable ? 'bg-green-100 text-green-800 ring-green-200 hover:bg-green-200' : 'bg-red-100 text-red-800 ring-red-200 hover:bg-red-200'
                            } disabled:opacity-50`}
                        >
                            {isUpdating && item.id === item.id ? 'Updating...' : (isAvailable ? 'Available' : 'Unavailable')}
                        </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1 text-gray-500 hover:bg-gray-200 rounded-md" aria-label="Edit Item"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(item)} className="p-1 text-red-500 hover:bg-red-100 rounded-md" aria-label="Delete Item"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )})}
            </tbody>
            </table>
          {equipmentList.length === 0 && <p className="py-8 text-center text-gray-500">No equipment found. Please sync the database in Settings.</p>}
        </div>
      </Card>
      
      <Card title="Database Sync Utility">
        <p className="text-sm text-gray-600 mb-4">The most common reason for **"Failed to Update"** is a missing **Row Level Security (RLS)** policy that grants the authenticated admin user write access. You should run the database sync to ensure the necessary policies are applied.</p>
        <button
            onClick={() => addToast({ type: 'info', title: 'Action Required', message: 'Please navigate to the Settings tab and click "Sync Now" to fix RLS permissions.' })}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Database className="w-4 h-4" /> Go to Settings Tab to Sync
        </button>
      </Card>
    </div>
  );
};

export default EquipmentTab;