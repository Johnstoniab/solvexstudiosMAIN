// @ts-nocheck
import React, { useState, useEffect } from "react";
import { ArrowRight, CircleCheck as CheckCircle, ShoppingCart, Loader as Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase/client";
import { useCart } from "../contexts/CartContext";

type RentalEquipment = {
  id: string;
  name: string;
  description: string;
  price_per_day: number;
  availability: string;
  image_url: string;
};

interface RentalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  rental: RentalEquipment | null;
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
        <h2 className="text-2xl font-bold mb-4">{rental.name}</h2>
        <p className="text-gray-600 mb-6">{rental.description}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-video bg-gray-100 rounded-lg">
            {rental.image_url && (
              <img
                src={rental.image_url}
                alt={rental.name}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          
          <div>
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">GHS {rental.price_per_day}/day</span>
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

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError("Could not load equipment. Please try again later.");
        console.error(fetchError);
      } else {
        setEquipmentList(data || []);
      }
      setLoading(false);
    };
    fetchEquipment();

    const channel = supabase
      .channel('public:equipment')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'equipment' }, (payload) => {
        fetchEquipment();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const handleOpenDetails = (equipment: RentalEquipment) => {
    setSelectedRental(equipment);
  };
  
  const handleAddToCart = (equipment: RentalEquipment) => {
    addToCart(equipment as any); // You may need to adjust your cart context to handle the new data structure
    setJustAdded(equipment.name);
    setTimeout(() => setJustAdded(null), 1500);
  };
  
  return (
    <>
      <div className="sr-only" aria-live="polite">
        {justAdded ? `${justAdded} added to cart` : ''}
      </div>

      <section
        id="rentals"
        className="py-16 md:py-24 bg-white"
        aria-busy={loading ? "true" : "false"}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Professional Tools. Affordable Access.
            </h2>
            <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
              We provide creators with high-quality equipment at fair rates.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {equipmentList.map((product) => {
                const isAdded = justAdded === product.name;
                const isAvailable = product.availability === 'Available';
                return (
                  <div
                    key={product.id}
                    onClick={() => handleOpenDetails(product)}
                    role="button"
                    tabIndex={0}
                    className="card bg-white rounded-2xl shadow-md overflow-hidden group flex flex-col cursor-pointer hover:shadow-2xl"
                  >
                    <div>
                      <img
                        src={product.image_url || 'https://via.placeholder.com/384x216'}
                        alt={product.name}
                        className="w-full h-48 object-cover bg-gray-50"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
                          />
                          <p className="text-xs text-gray-500">
                            {product.availability} • GHS {product.price_per_day}/day
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
                          disabled={!isAvailable || isAdded}
                        >
                          {isAdded ? ( <><CheckCircle size={14} /> Added!</> )
                          : !isAvailable ? ( `Unavailable` )
                          : ( <><ShoppingCart size={14} /> Add to Cart</> )
                          }
                        </button>
                        <div className="inline-flex items-center text-sm font-semibold text-[#FF5722]">
                          View Details
                          <ArrowRight className="ml-1 w-4 h-4" />
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
      />
    </>
  );
};

export default RentalsPage;