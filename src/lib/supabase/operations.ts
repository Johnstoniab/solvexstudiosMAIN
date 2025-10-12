// @ts-nocheck
// src/lib/supabase/operations.ts

import { supabase } from './client';
import type { Database } from './database.types';

export type Service = Database['public']['Tables']['services']['Row'];
export type ServiceInsert = Database['public']['Tables']['services']['Insert'];
export type ServiceUpdate = Database['public']['Tables']['services']['Update'];

// --- RENTAL EQUIPMENT OPERATIONS (NEW) ---
export type RentalEquipment = Database['public']['Tables']['rental_equipment']['Row'];

// Fetches all equipment for the public (only 'Available' status)
export const getRentalEquipment = async () => {
  return supabase.from('rental_equipment').select('*').eq('status', 'Available');
};

// Fetches ALL equipment for the admin dashboard
export const getAllRentalEquipment = async () => {
  return supabase.from('rental_equipment').select('*');
};


// Updates a piece of rental equipment
export const updateRentalEquipment = async (id: string, updates: Partial<RentalEquipment>) => {
  return supabase.from('rental_equipment').update(updates).eq('id', id);
};

// Subscribes to real-time changes on the rental_equipment table
export const onRentalEquipmentChange = (callback: () => void) => {
  return supabase
    .channel('public:rental_equipment')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'rental_equipment' }, callback)
    .subscribe();
};


// --- REAL-TIME SERVICE OPERATIONS ---

// Get all active (not deleted) services
export const getServices = async () => supabase.from('services').select('*').eq('is_deleted', false);

// Get all soft-deleted services for the restore view
export const getDeletedServices = async () => supabase.from('services').select('*').eq('is_deleted', true);

// Create a new service
export const createService = async (service: ServiceInsert) => supabase.from('services').insert(service).select().single();

// Update an existing service
export const updateService = async (id: string, service: ServiceUpdate) => supabase.from('services').update(service).eq('id', id).select().single();

// Soft delete a service by setting is_deleted to true
export const softDeleteService = async (id: string) => {
  return supabase
    .from('services')
    .update({ is_deleted: true, deleted_at: new Date().toISOString() })
    .eq('id', id);
};

// Restore a service by setting is_deleted to false
export const restoreService = async (id: string) => {
  return supabase
    .from('services')
    .update({ is_deleted: false, deleted_at: null })
    .eq('id', id);
};

// Listen for any changes in the services table
export const onServicesChange = (callback: (payload: any) => void) => {
  return supabase
    .channel('public:services')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, callback)
    .subscribe();
};


// --- EXISTING OPERATIONS (Unchanged) ---
export const getOrCreateClientForUser = async (userId: string, email?: string, fullName?: string) => ({ data: null, error: null });
export const createServiceRequest = async (...args: any[]) => ({ data: null, error: null });
export const listMyServiceRequests = async (...args: any[]) => ({ data: [], error: null });
export const getJobTeamsAndPositions = async (...args: any[]) => ({ data: { teams: [], positions: [] }, error: null });
export const updateJobTeam = async (...args: any[]) => ({ data: null, error: null });
export const updateJobPosition = async (...args: any[]) => ({ data: null, error: null });
export const listClientsWithStats = async (...args: any[]) => ({ data: [], error: null });
export const listServiceRequests = async (...args: any[]) => ({ data: [], error: null });
export const updateServiceRequestStatus = async (...args: any[]) => ({ data: null, error: null });
export const getCareerApplications = async (...args: any[]) => ({ data: [], error: null });
export const updateCareerApplicationStatus = async (...args: any[]) => ({ data: null, error: null });
export const createMember = async (...args: any[]) => ({ data: null, error: null });
export const getTeams = async () => ({ data: [], error: null });
export const getMembers = async () => ({ data: [], error: null });

export type ServiceRequestStatus =
  | "requested"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "pending";
```

### 3. Admin Dashboard: The Control Panel

This is your new **Equipment** tab. It fetches all rental items from Supabase and subscribes to real-time updates. You can now change the status or price of any item directly from this table, and the changes will be saved instantly.

**File**: `src/pages/admin/DashboardPage/tabs/EquipmentTab.tsx`
```typescript
import React, { useState, useEffect, useCallback } from "react";
import { Loader2, CheckCircle } from "lucide-react";
import Card from "../components/Card";
import { getAllRentalEquipment, updateRentalEquipment, onRentalEquipmentChange } from "../../../../lib/supabase/operations";
import type { Database } from "../../../../lib/supabase/database.types";
import { supabase } from "../../../../lib/supabase/client";
import { useToast } from "../../../../contexts/ToastContext";

type Equipment = Database['public']['Tables']['rental_equipment']['Row'];
type EquipmentStatus = Equipment['status'];

const EquipmentTab: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const { addToast } = useToast();

  const fetchEquipment = useCallback(async () => {
    // Only show full loader on initial fetch
    if (equipment.length === 0) setLoading(true);

    const { data, error: fetchError } = await getAllRentalEquipment();
    if (fetchError) {
      setError("Failed to load equipment data.");
      addToast({ type: 'error', title: 'Loading Error', message: fetchError.message });
      console.error(fetchError);
    } else {
      setEquipment(data || []);
    }
    setLoading(false);
  }, [addToast, equipment.length]);

  useEffect(() => {
    fetchEquipment();

    const channel = onRentalEquipmentChange(() => {
      addToast({ type: 'info', title: 'Live Update', message: 'Equipment data has been updated.' });
      fetchEquipment();
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEquipment, addToast]);


  const handleUpdate = async (id: string, updates: Partial<Equipment>) => {
    const originalEquipment = [...equipment];
    
    // Optimistic UI update
    setEquipment(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));

    const { error: updateError } = await updateRentalEquipment(id, updates);

    if (updateError) {
      setError("Failed to save changes. Please try again.");
      addToast({ type: 'error', title: 'Update Failed', message: updateError.message });
      setEquipment(originalEquipment); // Revert on failure
    } else {
      addToast({ type: 'success', title: 'Update Successful' });
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
    const item = equipment.find(e => e.id === id);
    // Only update if the price has actually changed
    if (item && item.price !== currentPrice) {
      handleUpdate(id, { price: currentPrice });
    }
    setEditingPriceId(null);
  };

  const statusOptions: EquipmentStatus[] = ['Available', 'Maintenance', 'Retired'];
  const statusColors: Record<EquipmentStatus, string> = {
    Available: 'bg-green-100 text-green-800 ring-green-200',
    Maintenance: 'bg-amber-100 text-amber-800 ring-amber-200',
    Retired: 'bg-red-100 text-red-800 ring-red-200',
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-gray-400" /></div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <Card title="Equipment Inventory & Management">
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
                          onClick={() => { setEditingPriceId(item.id); setCurrentPrice(Number(item.price)); }}
                          className="cursor-pointer font-semibold text-gray-800 p-1 rounded-md hover:bg-gray-200"
                        >
                          {Number(item.price).toFixed(2)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </Card>
    </div>
  );
};

export default EquipmentTab;
```

### 4. Public Rentals Page: The Live Display

Finally, I've updated your public-facing `RentalsPage.tsx`. It now fetches data directly from your Supabase table and listens for real-time changes. If you update a price or change an item's status to "Maintenance" in the admin panel, the public page will update instantly.

**File**: `src/pages/RentalsPage.tsx`
```typescript
// @ts-nocheck
import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, CircleCheck as CheckCircle, ShoppingCart, Loader2 } from "lucide-react";
import type { Database } from "../lib/supabase/database.types";
import { getRentalEquipment, onRentalEquipmentChange } from "../lib/supabase/operations";
import { useCart } from "../contexts/CartContext";
import { supabase } from "../lib/supabase/client";
import { useToast } from "../contexts/ToastContext";

type RentalEquipment = Database['public']['Tables']['rental_equipment']['Row'];

interface RentalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  rental: RentalEquipment | null;
  anchorId: string | null;
}

const RentalDetailModal: React.FC<RentalDetailModalProps> = ({ isOpen, onClose, rental }) => {
  if (!isOpen || !rental) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">{rental.title}</h2>
        <p className="text-gray-600 mb-6">{rental.subtitle}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-video">
            <iframe
              src={rental.video_url || ''}
              title={`${rental.title} video`}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allowFullScreen
            />
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 mb-4">Features</h3>
            <ul className="space-y-2">
              {(rental.features || []).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">GHS {rental.price}/day</span>
                <button className="bg-[#FF5722] text-white px-6 py-2 rounded-lg hover:bg-[#E64A19]">
                  Rent Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RentalsPage = () => {
  const [equipmentList, setEquipmentList] = useState<RentalEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRental, setSelectedRental] = useState<RentalEquipment | null>(null);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const fetchEquipment = useCallback(async () => {
    // Only show full page loader on initial load
    if (equipmentList.length === 0) setLoading(true);

    const { data, error: fetchError } = await getRentalEquipment();
    if (fetchError) {
      setError("Could not load equipment. Please try again later.");
      addToast({ type: 'error', title: 'Error', message: 'Could not load equipment.' });
      console.error(fetchError);
    } else {
      setEquipmentList(data || []);
    }
    setLoading(false);
  }, [addToast, equipmentList.length]);

  useEffect(() => {
    fetchEquipment();

    const channel = onRentalEquipmentChange(() => {
      // Data has changed, refetch from the database
      fetchEquipment();
    });

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEquipment]);
  
  const handleOpenDetails = (equipment: RentalEquipment) => {
    setSelectedRental(equipment);
  };
  
  const handleAddToCart = (equipment: RentalEquipment) => {
    addToCart(equipment as any);
    setJustAdded(equipment.title);
    setTimeout(() => setJustAdded(null), 1500);
  };
  
  return (
    <>
      {/* Screen-reader announcement for add-to-cart */}
      <div className="sr-only" aria-live="polite">
        {justAdded ? `${justAdded} added to cart` : ''}
      </div>

      <section
        id="rentals"
        className="py-16 md:py-24 bg-white"
        aria-busy={loading ? "true" : "false"}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@700;800&family=Manrope:wght@700;800&display=swap');
          .animated-gradient-text { background-image: linear-gradient(90deg, #111 0%, #111 28%, #FF5722 50%, #111 72%, #111 100%); -webkit-background-clip: text; background-clip: text; color: transparent; background-size: 200% 100%; animation: sheen-move 3s ease-in-out infinite; }
          @keyframes sheen-move { 0% { background-position: 200% 0; } 50% { background-position: 100% 0; } 100% { background-position: -200% 0; } }
          .heading-underline { position: absolute; left: 0; right: 0; height: 3px; bottom: -8px; border-radius: 9999px; background: linear-gradient(90deg, rgba(255,87,34,0) 0%, rgba(255,87,34,.85) 35%, rgba(255,87,34,.85) 65%, rgba(255,87,34,0) 100%); transform-origin: left; transform: scaleX(0); animation: underline-reveal 3s ease forwards 400ms; opacity: 0.95; }
          @keyframes underline-reveal { from { transform: scaleX(0); } to { transform: scaleX(1); } }

          /* Motion-safe micro-lift for cards (GPU accelerated) */
          @media (prefers-reduced-motion: no-preference) {
            .card { transition: transform 300ms, box-shadow 300ms; transform: translateZ(0); }
            .card:hover { transform: translateY(-2px); }
          }
        `}</style>

        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight" style={{ fontFamily: '"Inter Tight","Manrope",system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif' }}>
              <span className="animated-gradient-text relative inline-block">
                Professional Tools. Affordable Access.
                <span className="heading-underline" />
              </span>
            </h2>
            <p className="text-sm text-gray-600 mt-4 max-w-3xl mx-auto">
              We provide creators and SMEs with high-quality equipment at fair rates, so you can produce world-class content without compromise. Call us today and bring your production to life.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {equipmentList.map((product) => {
                const isAdded = justAdded === product.title;
                const isAvailable = product.status === 'Available';
                return (
                  <div
                    key={product.id}
                    onClick={() => handleOpenDetails(product)}
                    onKeyDown={(e) => { 
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpenDetails(product);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="card bg-white rounded-2xl shadow-md overflow-hidden group flex flex-col cursor-pointer hover:shadow-2xl"
                    style={{ contentVisibility: 'auto', containIntrinsicSize: '384px' }}
                  >
                    <div>
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                        className="w-full h-48 object-contain bg-gray-50 will-change-transform transform-gpu"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{product.subtitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                            aria-label={isAvailable ? 'Available' : 'Unavailable'}
                            title={isAvailable ? 'Available' : 'Unavailable'}
                          />
                          <p className="text-xs text-gray-500" title={`Category: ${product.category} • Price: GHS ${product.price}/day`}>
                            {product.category} • GHS {product.price}/day
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isAvailable) handleAddToCart(product);
                          }}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-colors flex items-center gap-1 z-10 ${
                            isAdded ? 'bg-green-600 text-white'
                            : !isAvailable ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#FF5722] text-white hover:bg-[#E64A19]'
                          }`}
                          aria-disabled={!isAvailable || isAdded}
                          aria-label={
                            isAdded ? `${product.title} added to cart`
                            : !isAvailable ? `${product.title} unavailable`
                            : `Add ${product.title} to cart`
                          }
                          disabled={!isAvailable || isAdded}
                        >
                          {isAdded ? ( <><CheckCircle size={14} /> Added!</> )
                          : !isAvailable ? ( `Unavailable` )
                          : ( <><ShoppingCart size={14} /> Add to Cart</> )
                          }
                        </button>
                        
                        <div className="inline-flex items-center text-sm font-semibold text-[#FF5722]">
                          View Details
                          <ArrowRight className="ml-1 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                ); 
              })}
            </div>
          )}
        </div>
      </section>

      <RentalDetailModal
        isOpen={!!selectedRental}
        onClose={() => setSelectedRental(null)}
        rental={selectedRental}
        anchorId={selectedRental ? `card-${selectedRental.id}` : null}
      />
    </>
  );
};

export default RentalsPage;
