import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import { Plus, Edit, Trash2, Send, Loader2, Database, RotateCcw, Trash, ArrowLeft } from 'lucide-react';
import {
  getServices,
  createService,
  updateService,
  softDeleteService,
  restoreService,
  getDeletedServices,
  onServicesChange,
  Service
} from '../../../../lib/supabase/operations';
import { useToast } from '../../../../contexts/ToastContext';
import { businessServicesData } from '../../../../data/business/services.data';
import { supabase } from '../../../../lib/supabase/client';

const emptyService: Partial<Service> = {
  title: "", summary: "", image_url: "", title_color: "text-sky-800",
  description: "", sub_services: [], outcome: "", status: 'draft',
  image_fit: 'cover', image_position: 'center', image_rotation: 0,
};

const ServicesTab: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [deletedServices, setDeletedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [view, setView] = useState<'active' | 'deleted'>('active');
  const { addToast } = useToast();

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    const [servicesResult, deletedServicesResult] = await Promise.all([getServices(), getDeletedServices()]);
    
    if (servicesResult.error) addToast({ type: 'error', title: 'Error Fetching Services' });
    else setServices(servicesResult.data || []);
    
    if (deletedServicesResult.error) addToast({ type: 'error', title: 'Error Fetching Deleted Services' });
    else setDeletedServices(deletedServicesResult.data || []);
    
    setLoading(false);
  }, [addToast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleAddNew = () => setEditingService(emptyService);
  const handleEdit = (service: Service) => setEditingService(service);
  const handleCancel = () => setEditingService(null);

  const handleSave = async () => {
    if (!editingService) return;
    const isUpdating = 'id' in editingService && editingService.id;

    setIsFormOpen(false);
    setEditingService(null);

    if (isUpdating) {
      const { error } = await updateService(editingService.id!, editingService);
      if (error) addToast({ type: 'error', title: 'Update Failed', message: error.message });
      else addToast({ type: 'success', title: 'Service Updated!' });
    } else {
      await createService(editingService as any);
    }
    await fetchAllData();
  };
  
  const handleDelete = async (service: Service) => {
    // ...
  }

  const handleRestore = async (service: Service) => {
    // ...
  }
  
  const handlePublish = async (service: Service) => {
    // ...
  };

  const handleSeedDatabase = async () => {
    // ...
  };

  if (isFormOpen && editingService) {
    return (
       <Card title={editingService.id ? "Edit Service" : "Add New Service"}>
        {/* ... The form JSX ... */}
       </Card>
    );
  }

  const currentList = view === 'active' ? services : deletedServices;

  return (
    <Card title={view === 'active' ? "Manage Services" : "Deleted Services"} right={
      <div className="flex items-center gap-2">
        {view === 'active' ? (
          <button onClick={() => setView('deleted')} className="flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
            <Trash size={16} /> View Deleted ({deletedServices.length})
          </button>
        ) : (
          <button onClick={() => setView('active')} className="flex items-center gap-2 text-gray-600 bg-gray-100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200">
            <ArrowLeft size={16} /> Back to Active
          </button>
        )}
        {view === 'active' && (
          <button onClick={handleAddNew} className="flex items-center gap-2 bg-[#FF5722] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#E64A19]">
            <Plus size={16} /> Add New
          </button>
        )}
      </div>
    }>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>
      ) : currentList.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>{view === 'active' ? 'No active services found.' : 'The trash is empty.'}</p>
          {view === 'active' && services.length === 0 && deletedServices.length === 0 && (
             <button onClick={handleSeedDatabase} className="mt-4 flex items-center gap-2 mx-auto bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
               <Database size={16} /> Seed Initial Services
             </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map(service => (
            <div key={service.id} className={`flex items-center justify-between p-4 rounded-lg border ${view === 'deleted' ? 'bg-red-50 border-red-200' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <img src={service.image_url || 'https://via.placeholder.com/150'} alt={service.title} className="w-16 h-16 object-cover rounded-md bg-gray-200" style={{ objectFit: (service.image_fit || 'cover') as any, objectPosition: service.image_position || 'center', transform: `rotate(${service.image_rotation || 0}deg)` }} />
                <div>
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-gray-800">{service.title}</h4>
                    {view === 'active' && (
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${service.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {service.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 max-w-md mt-1">{service.summary}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {view === 'active' ? (
                  <>
                    <button onClick={() => handlePublish(service)} className={`p-2 rounded-md ${service.status === 'published' ? 'text-gray-500 bg-gray-200 hover:bg-gray-300' : 'text-green-600 bg-green-100 hover:bg-green-200'}`} aria-label={service.status === 'published' ? `Unpublish ${service.title}` : `Publish ${service.title}`}>
                      <Send size={16} />
                    </button>
                    <button onClick={() => handleEdit(service)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-md" aria-label={`Edit ${service.title}`}><Edit size={16} /></button>
                    <button onClick={() => handleDelete(service)} className="p-2 text-red-500 hover:bg-red-100 rounded-md" aria-label={`Delete ${service.title}`}><Trash2 size={16} /></button>
                  </>
                ) : (
                   <button onClick={() => handleRestore(service)} className="flex items-center gap-2 text-blue-600 bg-blue-100 hover:bg-blue-200 px-3 py-1.5 rounded-md text-sm font-semibold" aria-label={`Restore ${service.title}`}>
                    <RotateCcw size={16} /> Restore
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default ServicesTab;