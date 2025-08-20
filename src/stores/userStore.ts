import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  User, 
  UserFilters, 
  CreateUserRequest, 
  UpdateUserRequest,
  UserActivity,
  UserReport 
} from '@/shared/types/user';

interface UserState {
  // État
  users: User[];
  currentUser: User | null;
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  filters: UserFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  userActivities: UserActivity[];
  userReports: UserReport[];

  // Actions
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User | null) => void;
  setSelectedUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<UserFilters>) => void;
  setPagination: (pagination: Partial<UserState['pagination']>) => void;
  setUserActivities: (activities: UserActivity[]) => void;
  setUserReports: (reports: UserReport[]) => void;

  // Actions CRUD
  fetchUsers: (filters?: UserFilters) => Promise<void>;
  fetchUserById: (id: string) => Promise<User | null>;
  createUser: (userData: CreateUserRequest) => Promise<User | null>;
  updateUser: (id: string, userData: UpdateUserRequest) => Promise<User | null>;
  deleteUser: (id: string) => Promise<boolean>;
  suspendUser: (id: string, reason: string) => Promise<boolean>;
  activateUser: (id: string) => Promise<boolean>;
  banUser: (id: string, reason: string) => Promise<boolean>;
  verifyUser: (id: string) => Promise<boolean>;
  changeUserRole: (id: string, role: User['role']) => Promise<boolean>;

  // Actions pour les activités et rapports
  fetchUserActivities: (userId: string) => Promise<void>;
  fetchUserReports: (filters?: Partial<UserFilters>) => Promise<void>;
  createUserReport: (report: Omit<UserReport, 'id' | 'createdAt' | 'updatedAt'>) => Promise<UserReport | null>;
  updateUserReport: (id: string, status: UserReport['status'], notes?: string) => Promise<boolean>;

  // Actions utilitaires
  searchUsers: (query: string) => Promise<User[]>;
  exportUsers: (filters?: UserFilters) => Promise<void>;
  bulkAction: (userIds: string[], action: 'suspend' | 'activate' | 'delete' | 'verify') => Promise<boolean>;
  clearError: () => void;
  resetFilters: () => void;
}

const initialState = {
  users: [],
  currentUser: null,
  selectedUser: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    role: undefined,
    status: undefined,
    isVerified: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    sortBy: 'createdAt' as const,
    sortOrder: 'desc' as const,
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  userActivities: [],
  userReports: [],
};

export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Setters
      setUsers: (users) => set({ users }),
      setCurrentUser: (currentUser) => set({ currentUser }),
      setSelectedUser: (selectedUser) => set({ selectedUser }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setFilters: (filters) => set((state) => ({ 
        filters: { ...state.filters, ...filters } 
      })),
      setPagination: (pagination) => set((state) => ({ 
        pagination: { ...state.pagination, ...pagination } 
      })),
      setUserActivities: (userActivities) => set({ userActivities }),
      setUserReports: (userReports) => set({ userReports }),

      // Actions CRUD
      fetchUsers: async () => {
        set({ loading: true, error: null });
        try {
          
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUsers: User[] = [
            {
              id: '1',
              email: 'admin@zouglou.com',
              firstName: 'Admin',
              lastName: 'Zouglou',
              username: 'admin_zouglou',
              role: 'admin',
              status: 'active',
              isVerified: true,
              isEmailVerified: true,
              createdAt: new Date('2024-01-01'),
              updatedAt: new Date(),
            },
            {
              id: '2',
              email: 'artist@zouglou.com',
              firstName: 'John',
              lastName: 'Doe',
              username: 'john_doe_artist',
              role: 'artist',
              status: 'active',
              isVerified: true,
              isEmailVerified: true,
              createdAt: new Date('2024-01-15'),
              updatedAt: new Date(),
            },
            {
              id: '3',
              email: 'user@zouglou.com',
              firstName: 'Jane',
              lastName: 'Smith',
              username: 'jane_smith',
              role: 'user',
              status: 'active',
              isVerified: false,
              isEmailVerified: true,
              createdAt: new Date('2024-02-01'),
              updatedAt: new Date(),
            },
          ];

          set({ 
            users: mockUsers, 
            pagination: { 
              page: 1, 
              limit: 20, 
              total: mockUsers.length, 
              totalPages: 1 
            },
            loading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors du chargement des utilisateurs',
            loading: false 
          });
        }
      },

      fetchUserById: async (id) => {
        set({ loading: true, error: null });
        try {
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockUser: User = {
            id,
            email: 'user@example.com',
            firstName: 'Utilisateur',
            lastName: 'Test',
            username: 'utilisateur_test',
            role: 'user',
            status: 'active',
            isVerified: true,
            isEmailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set({ selectedUser: mockUser, loading: false });
          return mockUser;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors du chargement de l\'utilisateur',
            loading: false 
          });
          return null;
        }
      },

      createUser: async (userData) => {
        set({ loading: true, error: null });
        try {
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newUser: User = {
            id: Date.now().toString(),
            ...userData,
            role: userData.role || 'user',
            status: 'active',
            isVerified: false,
            isEmailVerified: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({ 
            users: [newUser, ...state.users],
            loading: false 
          }));
          
          return newUser;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors de la création de l\'utilisateur',
            loading: false 
          });
          return null;
        }
      },

      updateUser: async (id, userData) => {
        set({ loading: true, error: null });
        try {
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            users: state.users.map(user => 
              user.id === id 
                ? { ...user, ...userData, updatedAt: new Date() }
                : user
            ),
            selectedUser: state.selectedUser?.id === id 
              ? { ...state.selectedUser, ...userData, updatedAt: new Date() }
              : state.selectedUser,
            loading: false
          }));

          return get().users.find(user => user.id === id) || null;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'utilisateur',
            loading: false 
          });
          return null;
        }
      },

      deleteUser: async (id) => {
        set({ loading: true, error: null });
        try {
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            users: state.users.filter(user => user.id !== id),
            selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
            loading: false
          }));

          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'utilisateur',
            loading: false 
          });
          return false;
        }
      },

      suspendUser: async (id) => {
        return get().updateUser(id, { status: 'suspended' });
      },

      activateUser: async (id) => {
        return get().updateUser(id, { status: 'active' });
      },

      banUser: async (id) => {
        return get().updateUser(id, { status: 'banned' });
      },

      verifyUser: async (id) => {
        return get().updateUser(id, { isVerified: true });
      },

      changeUserRole: async (id, role) => {
        return get().updateUser(id, { role });
      },

      // Actions pour les activités et rapports
      fetchUserActivities: async (userId) => {
        set({ loading: true, error: null });
        try {
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockActivities: UserActivity[] = [
            {
              id: '1',
              userId,
              type: 'login',
              description: 'Connexion réussie',
              ipAddress: '192.168.1.1',
              userAgent: 'Mozilla/5.0...',
              createdAt: new Date(),
            },
            {
              id: '2',
              userId,
              type: 'profile_update',
              description: 'Profil mis à jour',
              createdAt: new Date(Date.now() - 86400000),
            },
          ];

          set({ userActivities: mockActivities, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors du chargement des activités',
            loading: false 
          });
        }
      },

      fetchUserReports: async () => {
        set({ loading: true, error: null });
        try {
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockReports: UserReport[] = [
            {
              id: '1',
              reporterId: 'user1',
              reportedUserId: 'user2',
              reason: 'spam',
              description: 'Utilisateur envoie des messages spam',
              status: 'pending',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ];

          set({ userReports: mockReports, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors du chargement des rapports',
            loading: false 
          });
        }
      },

      createUserReport: async (report) => {
        set({ loading: true, error: null });
        try {
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newReport: UserReport = {
            id: Date.now().toString(),
            ...report,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          set((state) => ({ 
            userReports: [newReport, ...state.userReports],
            loading: false 
          }));
          
          return newReport;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors de la création du rapport',
            loading: false 
          });
          return null;
        }
      },

      updateUserReport: async (id, status, notes) => {
        set({ loading: true, error: null });
        try {
          // Simulation d'appel API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set((state) => ({
            userReports: state.userReports.map(report => 
              report.id === id 
                ? { 
                    ...report, 
                    status, 
                    moderatorNotes: notes,
                    updatedAt: new Date(),
                    resolvedAt: status === 'resolved' ? new Date() : undefined
                  }
                : report
            ),
            loading: false
          }));

          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du rapport',
            loading: false 
          });
          return false;
        }
      },

      // Actions utilitaires
      searchUsers: async (query) => {
        // Simulation de recherche
        await new Promise(resolve => setTimeout(resolve, 300));
        return get().users.filter(user => 
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.firstName?.toLowerCase().includes(query.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(query.toLowerCase()) ||
          user.username.toLowerCase().includes(query.toLowerCase())
        );
      },

      exportUsers: async () => {
        set({ loading: true, error: null });
        try {
          // Simulation d'export
          await new Promise(resolve => setTimeout(resolve, 2000));
          set({ loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors de l\'export',
            loading: false 
          });
        }
      },

      bulkAction: async (userIds, action) => {
        set({ loading: true, error: null });
        try {
          // Simulation d'action en masse
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          set((state) => ({
            users: state.users.map(user => {
              if (userIds.includes(user.id)) {
                switch (action) {
                  case 'suspend':
                    return { ...user, status: 'suspended', updatedAt: new Date() };
                  case 'activate':
                    return { ...user, status: 'active', updatedAt: new Date() };
                  case 'delete':
                    return { ...user, status: 'banned', updatedAt: new Date() };
                  case 'verify':
                    return { ...user, isVerified: true, updatedAt: new Date() };
                  default:
                    return user;
                }
              }
              return user;
            }),
            loading: false
          }));

          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Erreur lors de l\'action en masse',
            loading: false 
          });
          return false;
        }
      },

      clearError: () => set({ error: null }),
      resetFilters: () => set({ filters: initialState.filters }),
    }),
    {
      name: 'user-store',
    }
  )
); 