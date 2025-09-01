'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCreateCity, useUpdateCity, useCity } from '@/hooks/useCityQueries';
import { AdminCityCreateRequest, AdminCityUpdateRequest } from '@/shared/types/city';
import { Loader2, MapPin, Upload, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Image from 'next/image';

interface CityModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityId?: string;
  onSuccess?: () => void;
}

export const CityModal: React.FC<CityModalProps> = ({ 
  isOpen, 
  onClose, 
  cityId, 
  onSuccess 
}) => {
  const isEditing = !!cityId;
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Récupérer la ville existante si on est en mode édition
  const { data: existingCity, isLoading: isLoadingCity } = useCity(cityId || '');
  
  const createCityMutation = useCreateCity();
  const updateCityMutation = useUpdateCity();

  const schema = yup.object({
    name: yup.string().required('Le nom est requis'),
    status: yup.boolean(),
    longitude: yup.string().nullable(),
    latitude: yup.string().nullable(),
  });

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      status: true,
      longitude: '',
      latitude: '',
    }
  });

  // Remplir le formulaire avec les données existantes
  useEffect(() => {
    if (existingCity) {
      setValue('name', existingCity.name);
      setValue('status', existingCity.status);
      setValue('longitude', existingCity.longitude || '');
      setValue('latitude', existingCity.latitude || '');
      
      if (existingCity.logo) {
        setLogoPreview(existingCity.logo);
      }
    }
  }, [existingCity, setValue]);

  // Réinitialiser le formulaire quand le modal s'ouvre
  useEffect(() => {
    if (isOpen && !isEditing) {
      reset();
      setLogoPreview(null);
      setLogoFile(null);
    }
  }, [isOpen, isEditing, reset]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const onSubmit = async (data: AdminCityCreateRequest | AdminCityUpdateRequest) => {
    try {
      const submitData = {
        ...data,
        logo: logoFile,
      };

      if (isEditing && cityId) {
        await updateCityMutation.mutateAsync({
          id: cityId,
          data: submitData as AdminCityUpdateRequest
        });
      } else {
        await createCityMutation.mutateAsync(submitData as AdminCityCreateRequest);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleClose = () => {
    reset();
    setLogoPreview(null);
    setLogoFile(null);
    onClose();
  };

  if (isLoadingCity) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="lg">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      </Modal>
    );
  }

  const isLoading = createCityMutation.isPending || updateCityMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-r from-[#005929]/10 to-[#FE5200]/10">
            <MapPin className="h-6 w-6 text-[#005929]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {isEditing ? 'Modifier la ville' : 'Nouvelle ville'}
            </h2>
            <p className="text-slate-600 text-sm">
              {isEditing 
                ? 'Modifiez les informations de la ville'
                : 'Créez une nouvelle ville'
              }
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Nom de la ville */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Nom de la ville *
            </label>
            <Input
              {...register('name')}
              placeholder="Ex: Abidjan, Cotonou, Porto-Novo..."
              className={errors.name ? 'border-red-300 focus:border-red-500' : ''}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Logo de la ville
            </label>
            <div className="space-y-3">
              {/* Upload */}
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                    <Upload className="h-4 w-4 text-slate-600" />
                    <span className="text-sm text-slate-700">Choisir un logo</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
                {logoPreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeLogo}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                )}
              </div>

              {/* Preview */}
              {logoPreview && (
                <div className="bg-slate-100/50 p-3 rounded-lg border border-slate-200/50">
                  <span className="text-sm font-medium text-slate-700 mb-2 block">Aperçu:</span>
                  <div className="relative w-24 h-24 mx-auto">
                    <Image
                      src={logoPreview}
                      alt="Aperçu du logo"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Coordonnées géographiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-slate-700 mb-2">
                Longitude
              </label>
              <Input
                {...register('longitude')}
                placeholder="Ex: 2.418333"
                className={errors.longitude ? 'border-red-300 focus:border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.longitude && (
                <p className="text-red-600 text-sm mt-1">{errors.longitude.message}</p>
              )}
              <p className="text-slate-500 text-xs mt-1">
                Format: -180.000000 à 180.000000
              </p>
            </div>

            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-slate-700 mb-2">
                Latitude
              </label>
              <Input
                {...register('latitude')}
                placeholder="Ex: 6.365361"
                className={errors.latitude ? 'border-red-300 focus:border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.latitude && (
                <p className="text-red-600 text-sm mt-1">{errors.latitude.message}</p>
              )}
              <p className="text-slate-500 text-xs mt-1">
                Format: -90.000000 à 90.000000
              </p>
            </div>
          </div>

          {/* Statut actif */}
          <div className="flex items-center space-x-3">
            <input
              {...register('status')}
              type="checkbox"
              className="h-4 w-4 text-[#005929] focus:ring-[#005929] border-slate-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="status" className="text-sm font-medium text-slate-700">
              Ville active
            </label>
          </div>
          <p className="text-slate-500 text-xs">
            Une ville inactive ne sera pas visible pour les utilisateurs
          </p>

          {/* Boutons d'action */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-[#005929] to-[#005929]/90 hover:from-[#005929]/90 hover:to-[#005929] text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  {isEditing ? 'Mettre à jour' : 'Créer'}
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
