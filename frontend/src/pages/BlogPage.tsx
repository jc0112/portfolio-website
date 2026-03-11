import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi } from '../services/api';
import type { BlogPost } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = { title: '', excerpt: '', content: '', published: true };

export default function BlogPage() {
  const { isOwner } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');

  const fetchPosts = async (query?: string) => {
    try {
      const res = query ? await blogApi.searchByTitle(query) : await blogApi.getAll();
      setPosts(res.data);
    } catch {
      setError('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts(search || undefined);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditing(post);
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content, published: post.published });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await blogApi.update(editing.id, form);
      } else {
        await blogApi.create(form);
      }
      setShowForm(false);
      fetchPosts();
    } catch {
      alert('Failed to save post');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await blogApi.delete(id);
    fetchPosts();
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="blog-page">
      <div className="page-header">
        <h1>Blog</h1>
        {isOwner && (
          <button className="btn-primary" onClick={openCreate}>+ New Post</button>
        )}
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="btn-secondary">Search</button>
        {search && (
          <button type="button" className="btn-secondary" onClick={() => { setSearch(''); fetchPosts(); }}>
            Clear
          </button>
        )}
      </form>

      {posts.length === 0 && (
        <p className="empty-state">No posts yet. {isOwner ? 'Write your first post!' : ''}</p>
      )}

      <div className="posts-list">
        {posts.map((post) => (
          <article key={post.id} className="post-preview">
            <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
            <p className="excerpt">{post.excerpt}</p>
            <div className="post-meta">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span>{post.viewCount} views</span>
              {!post.published && <span className="draft-badge">Draft</span>}
            </div>
            {isOwner && (
              <div className="owner-actions">
                <button className="btn-secondary" onClick={() => openEdit(post)}>Edit</button>
                <button className="btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
              </div>
            )}
          </article>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Post' : 'New Post'}</h2>
            <form onSubmit={handleSubmit}>
              <input placeholder="Title" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              <input placeholder="Excerpt (short summary)" value={form.excerpt}
                onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} />
              <textarea className="content-editor" placeholder="Content (Markdown supported)"
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required />
              <label className="checkbox-label">
                <input type="checkbox" checked={form.published}
                  onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
                Publish immediately
              </label>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  {editing ? 'Save Changes' : 'Create Post'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}