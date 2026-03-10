import { useEffect, useState } from 'react';
import { projectsApi, uploadFile } from '../services/api';
import type { Project } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EMPTY_FORM = {
  title: '', description: '', githubUrl: '', liveUrl: '', demoVideoUrl: '',
  technologies: '', thumbnailUrl: '',
};

export default function ProjectsPage() {
  const { isOwner } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await projectsApi.getAll();
      setProjects(res.data);
    } catch {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (project: Project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      demoVideoUrl: project.demoVideoUrl || '',
      technologies: project.technologies.join(', '),
      thumbnailUrl: project.thumbnailUrl || '',
    });
    setShowForm(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setForm(f => ({ ...f, thumbnailUrl: url }));
    } catch {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await projectsApi.update(editing.id, payload);
      } else {
        await projectsApi.create(payload);
      }
      setShowForm(false);
      fetchProjects();
    } catch {
      alert('Failed to save project');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await projectsApi.delete(id);
    fetchProjects();
  };

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="projects-page">
      <div className="page-header">
        <h1>My Projects</h1>
        {isOwner && (
          <button className="btn-primary" onClick={openCreate}>+ Add Project</button>
        )}
      </div>

      {projects.length === 0 && (
        <p className="empty-state">No projects yet. {isOwner ? 'Add your first project!' : ''}</p>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            {project.thumbnailUrl && (
              <img src={project.thumbnailUrl} alt={project.title} />
            )}
            <div className="card-body">
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="tech-stack">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-badge">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo</a>
                )}
                {project.demoVideoUrl && (
                  <a href={project.demoVideoUrl} target="_blank" rel="noopener noreferrer">Video</a>
                )}
              </div>
              {isOwner && (
                <div className="owner-actions">
                  <button className="btn-secondary" onClick={() => openEdit(project)}>Edit</button>
                  <button className="btn-danger" onClick={() => handleDelete(project.id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Project' : 'Add Project'}</h2>
            <form onSubmit={handleSubmit}>
              <input placeholder="Title" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              <textarea placeholder="Description" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
              <input placeholder="Technologies (comma separated, e.g. React, Java)"
                value={form.technologies}
                onChange={e => setForm(f => ({ ...f, technologies: e.target.value }))} />
              <input placeholder="GitHub URL" value={form.githubUrl}
                onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} />
              <input placeholder="Live Demo URL" value={form.liveUrl}
                onChange={e => setForm(f => ({ ...f, liveUrl: e.target.value }))} />
              <input placeholder="Demo Video URL" value={form.demoVideoUrl}
                onChange={e => setForm(f => ({ ...f, demoVideoUrl: e.target.value }))} />
              <div className="upload-field">
                <label>Thumbnail Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {uploading && <span>Uploading...</span>}
                {form.thumbnailUrl && <img src={form.thumbnailUrl} alt="preview" className="img-preview" />}
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={uploading}>
                  {editing ? 'Save Changes' : 'Create Project'}
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