import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  AuthResponse,
  Category,
  Lullaby,
  Playlist,
  PlaylistDetail,
  User,
} from '../lib/types';

export const TOKEN_KEY = 'luby_token';

// All server data flows through RTK Query (no Redux slices).
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Me', 'Likes', 'Playlists', 'Playlist'],
  endpoints: (builder) => ({
    // --- Public catalog ---
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
    }),
    getLullabies: builder.query<Lullaby[], { category?: string; search?: string } | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.category) params.set('category', args.category);
        if (args?.search) params.set('search', args.search);
        const qs = params.toString();
        return `/lullabies${qs ? `?${qs}` : ''}`;
      },
    }),
    getLullaby: builder.query<Lullaby, string>({
      query: (id) => `/lullabies/${id}`,
    }),

    // --- Auth ---
    register: builder.mutation<AuthResponse, { email: string; password: string; displayName: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    getMe: builder.query<User, void>({
      query: () => '/auth/me',
      providesTags: ['Me'],
    }),

    // --- Likes (the "Liked" playlist) ---
    getLikes: builder.query<Lullaby[], void>({
      query: () => '/me/likes',
      providesTags: ['Likes'],
    }),
    like: builder.mutation<void, string>({
      query: (lullabyId) => ({ url: `/me/likes/${lullabyId}`, method: 'PUT' }),
      invalidatesTags: ['Likes'],
    }),
    unlike: builder.mutation<void, string>({
      query: (lullabyId) => ({ url: `/me/likes/${lullabyId}`, method: 'DELETE' }),
      invalidatesTags: ['Likes'],
    }),

    // --- Playlists ---
    getPlaylists: builder.query<Playlist[], void>({
      query: () => '/me/playlists',
      providesTags: ['Playlists'],
    }),
    getPlaylist: builder.query<PlaylistDetail, string>({
      query: (id) => `/me/playlists/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Playlist', id }],
    }),
    createPlaylist: builder.mutation<Playlist, { name: string }>({
      query: (body) => ({ url: '/me/playlists', method: 'POST', body }),
      invalidatesTags: ['Playlists'],
    }),
    renamePlaylist: builder.mutation<Playlist, { id: string; name: string }>({
      query: ({ id, name }) => ({ url: `/me/playlists/${id}`, method: 'PATCH', body: { name } }),
      invalidatesTags: (_result, _error, { id }) => ['Playlists', { type: 'Playlist', id }],
    }),
    deletePlaylist: builder.mutation<void, string>({
      query: (id) => ({ url: `/me/playlists/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Playlists'],
    }),
    addPlaylistItem: builder.mutation<void, { playlistId: string; lullabyId: string }>({
      query: ({ playlistId, lullabyId }) => ({
        url: `/me/playlists/${playlistId}/items`,
        method: 'POST',
        body: { lullabyId },
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [
        { type: 'Playlist', id: playlistId },
        'Playlists',
      ],
    }),
    removePlaylistItem: builder.mutation<void, { playlistId: string; lullabyId: string }>({
      query: ({ playlistId, lullabyId }) => ({
        url: `/me/playlists/${playlistId}/items/${lullabyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { playlistId }) => [
        { type: 'Playlist', id: playlistId },
        'Playlists',
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetLullabiesQuery,
  useGetLullabyQuery,
  useRegisterMutation,
  useLoginMutation,
  useGetMeQuery,
  useGetLikesQuery,
  useLikeMutation,
  useUnlikeMutation,
  useGetPlaylistsQuery,
  useGetPlaylistQuery,
  useCreatePlaylistMutation,
  useRenamePlaylistMutation,
  useDeletePlaylistMutation,
  useAddPlaylistItemMutation,
  useRemovePlaylistItemMutation,
} = api;
