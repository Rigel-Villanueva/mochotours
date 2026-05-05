'use client';

import { useState, useEffect } from 'react';
import { ApiContactInfoRepository } from '../infrastructure/repositories/ApiContactInfoRepository';
import { GetContactInfo } from '../application/use-cases/GetContactInfo';
import { UpdateContactInfo } from '../application/use-cases/UpdateContactInfo';
import type { ContactInfo } from '../domain/entities/ContactInfo';
import { ContactInfoForm } from './ContactInfoForm';
import { toast } from 'sonner';

export function ContactInfoPanel() {
  const [data, setData] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Hexagonal dependencies wire-up
  const repository = new ApiContactInfoRepository();
  const getContactInfoUseCase = new GetContactInfo(repository);
  const updateContactInfoUseCase = new UpdateContactInfo(repository);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getContactInfoUseCase.execute();
        setData(result);
      } catch (err: unknown) {
        const error = err as Error;
        console.error('Failed to load contact info:', error);
        toast.error('Error de carga', { description: 'No se pudo cargar la información de contacto.' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (formData: ContactInfo) => {
    setIsSaving(true);
    try {
      const result = await updateContactInfoUseCase.execute(formData);
      setData(result);
      toast.success('Cambios guardados', { description: 'La información se actualizó correctamente.' });
      setIsEditing(false);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Failed to update contact info:', error);
      toast.error('Error al guardar', { description: 'Ocurrió un error al intentar guardar.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-stone-500">Cargando información...</div>;
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-32 -mx-4 -mt-8 pt-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-fraunces text-stone-900">Información de contacto</h2>
            <p className="text-stone-500 text-[15px] mt-1.5">Administra los teléfonos, correo y redes sociales que aparecen en la página pública.</p>
          </div>
          {!isEditing && !isLoading && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white border border-stone-200 text-stone-700 hover:text-stone-900 hover:bg-stone-50 rounded-lg text-sm font-medium transition-colors"
            >
              Editar datos
            </button>
          )}
        </div>

        <ContactInfoForm 
          initialData={data} 
          onSubmit={handleSave} 
          isLoading={isSaving} 
          isEditing={isEditing}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    </div>
  );
}
