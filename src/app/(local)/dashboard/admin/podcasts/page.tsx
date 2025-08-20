"use client";

import { useState } from "react";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { usePodcastList } from "@/hooks/usePodcastQuery";
import { Button } from "@/components/ui/Button";
import { ApiPodcast } from "@/shared/types/api";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";
import Image from "next/image";
export default function AdminPodcastsPage() {
    const { data: podcastsData, refetch, isLoading } = usePodcastList();
    const podcasts = podcastsData?.results || [];
    const [selectedPodcast, setSelectedPodcast] = useState<ApiPodcast | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = async (podcast: ApiPodcast) => {
        setSelectedPodcast(podcast);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedPodcast) {
            setIsDeleteModalOpen(false);
            setSelectedPodcast(null);
            refetch();
        }
    };

    if (isLoading) {
        return (
            <AdminRoute>
                <div className="p-6">
                    <Loading />
                </div>
            </AdminRoute>
        );
    }

    return (
        <AdminRoute>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Podcasts</h1>
                    <p className="text-gray-600 mt-2">Administration de tous les podcasts de la plateforme</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Podcasts ({podcasts.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Podcast
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Artiste
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Genre
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Épisodes
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Abonnés
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {podcasts.map((podcast: ApiPodcast) => (
                                    <tr key={podcast.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                    {podcast.cover ? (
                                                        <Image 
                                                            src={podcast.cover} 
                                                            alt={podcast.title}
                                                            className="w-full h-full object-cover rounded-lg"
                                                            width={40}
                                                            height={40}
                                                        />
                                                    ) : (
                                                        <div className="text-gray-400 text-lg">🎙️</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {podcast.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {podcast.description.substring(0, 50)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {podcast.artist}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {podcast.genre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {podcast.episodes_count}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {podcast.subscribers_count}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                podcast.is_published 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {podcast.is_published ? 'Publié' : 'Brouillon'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm">
                                                    Voir
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    Modifier
                                                </Button>
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm"
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                    onClick={() => handleDelete(podcast)}
                                                >
                                                    Supprimer
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {podcasts.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🎙️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun podcast</h3>
                            <p className="text-gray-600">Aucun podcast n&apos;a été créé sur la plateforme.</p>
                        </div>
                    )}
                </div>

                {/* Modal de confirmation de suppression */}
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                >
                    <div className="p-6">
                        <p className="text-gray-600 mb-6">
                            Êtes-vous sûr de vouloir supprimer le podcast &quot;{selectedPodcast?.title}&quot; ? 
                            Cette action est irréversible et supprimera également tous les épisodes associés.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button 
                                onClick={() => setIsDeleteModalOpen(false)}
                                variant="outline"
                            >
                                Annuler
                            </Button>
                            <Button 
                                onClick={confirmDelete}
                                variant="secondary"
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </Modal>
            </div>
        </AdminRoute>
    );
} 