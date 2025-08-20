"use client";

import { useState } from "react";
import { AdminRoute } from "@/components/auth/ProtectedRoute";
import { usePodcastEpisodeList } from "@/hooks/usePodcastQuery";
import { Button } from "@/components/ui/Button";
import { ApiPodcastEpisode } from "@/shared/types/api";
import { Modal } from "@/components/ui/Modal";
import { Loading } from "@/components/ui/Loading";

export default function AdminEpisodesPage() {
    const { data: episodesData, refetch, isLoading } = usePodcastEpisodeList();
    const episodes = episodesData?.results || [];
    const [selectedEpisode, setSelectedEpisode] = useState<ApiPodcastEpisode | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDelete = async (episode: ApiPodcastEpisode) => {
        setSelectedEpisode(episode);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (selectedEpisode) {
            setIsDeleteModalOpen(false);
            setSelectedEpisode(null);
            refetch();
        }
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Épisodes</h1>
                    <p className="text-gray-600 mt-2">Administration de tous les épisodes de podcast de la plateforme</p>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Épisodes ({episodes.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Épisode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Podcast
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Numéro
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Durée
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lectures
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Likes
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
                                {episodes.map((episode: ApiPodcastEpisode) => (
                                    <tr key={episode.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {episode.title}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {episode.description.substring(0, 50)}...
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {episode.podcast}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {episode.episode_number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatDuration(episode.duration)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {episode.play_count}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {episode.count_likes}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                episode.is_published 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {episode.is_published ? 'Publié' : 'Brouillon'}
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
                                                    onClick={() => handleDelete(episode)}
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

                    {episodes.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🎙️</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun épisode</h3>
                            <p className="text-gray-600">Aucun épisode n&apos;a été créé sur la plateforme.</p>
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
                                Êtes-vous sûr de vouloir supprimer l&apos;épisode &quot;{selectedEpisode?.title}&quot; ? 
                            Cette action est irréversible.
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