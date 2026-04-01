import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 (expired or invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Types
export type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  demoVideoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  displayOrder: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  published: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export type GalleryImage = {
  id: number;
  imageUrl: string;
  thumbnailUrl: string;
  caption: string;
  displayOrder: number;
  uploadedAt: string;
}

export type Tag = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
}

export type Comment = {
  id: number;
  content: string;
  anonymousName: string;
  createdAt: string;
}

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ token: string; username: string }>('/auth/login', { username, password }),
};

// Upload
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post<{ url: string }>('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.url;
};

// Projects
export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects'),
  create: (data: Partial<Project>) => api.post<Project>('/projects', data),
  update: (id: number, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

// Blog
export const blogApi = {
  getAll: () => api.get<BlogPost[]>('/posts'),
  getBySlug: (slug: string) => api.get<BlogPost>(`/posts/slug/${slug}`),
  searchByTitle: (title: string) => api.get<BlogPost[]>(`/posts/search?title=${title}`),
  getByTag: (tagSlug: string) => api.get<BlogPost[]>(`/posts/tag/${tagSlug}`),
  create: (data: Partial<BlogPost>) => api.post<BlogPost>('/posts', data),
  update: (id: number, data: Partial<BlogPost>) => api.put<BlogPost>(`/posts/${id}`, data),
  delete: (id: number) => api.delete(`/posts/${id}`),
};

// Gallery
export const galleryApi = {
  getAll: () => api.get<GalleryImage[]>('/gallery'),
  create: (data: Partial<GalleryImage>) => api.post<GalleryImage>('/gallery', data),
  delete: (id: number) => api.delete(`/gallery/${id}`),
};

// Comments
export const commentsApi = {
  getByPostId: (postId: number) => api.get<Comment[]>(`/comments/post/${postId}`),
  create: (postId: number, content: string) =>
    api.post<Comment>('/comments', { postId, content }),
  delete: (id: number) => api.delete(`/comments/${id}`),
};

// Tags
export const tagsApi = {
  getAll: () => api.get<Tag[]>('/tags'),
};

export default api;