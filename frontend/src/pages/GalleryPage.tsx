import { useEffect, useState, useCallback } from 'react';
import { galleryApi, uploadFile } from '../services/api';
import type { GalleryImage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function GalleryPage() {
  const { isOwner } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  const fetchImages = async () => {
    try {
      const res = await galleryApi.getAll();
      setImages(res.data);
    } catch {
      setError('Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const closeLightbox = useCallback(() => setLightboxImage(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeLightbox(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeLightbox]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    try {
      const url = await uploadFile(selectedFile);
      await galleryApi.create({ imageUrl: url, thumbnailUrl: url, caption });
      setShowUpload(false);
      setCaption('');
      setSelectedFile(null);
      setPreview(null);
      fetchImages();
    } catch {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this photo?')) return;
    await galleryApi.delete(id);
    if (lightboxImage?.id === id) closeLightbox();
    fetchImages();
  };

  if (loading) return <div className="loading">Loading gallery...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1>Gallery</h1>
        {isOwner && (
          <button className="btn-primary" onClick={() => setShowUpload(true)}>+ Upload Photo</button>
        )}
      </div>

      {images.length === 0 && (
        <p className="empty-state">No photos yet. {isOwner ? 'Upload your first photo!' : ''}</p>
      )}

      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.id} className="gallery-item" onClick={() => setLightboxImage(image)}>
            <div className="gallery-img-wrap">
              <img src={image.imageUrl} alt={image.caption} />
            </div>
            {image.caption && <p className="caption">{image.caption}</p>}
            {isOwner && (
              <button className="gallery-delete-btn" onClick={(e) => { e.stopPropagation(); handleDelete(image.id); }}>✕</button>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxImage.imageUrl} alt={lightboxImage.caption} />
            {lightboxImage.caption && (
              <p className="lightbox-caption">{lightboxImage.caption}</p>
            )}
            {isOwner && (
              <button className="btn-danger lightbox-delete" onClick={() => handleDelete(lightboxImage.id)}>
                Delete Photo
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <div className="modal-overlay" onClick={() => setShowUpload(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Upload Photo</h2>
            <form onSubmit={handleUpload}>
              <div className="upload-field">
                <input type="file" accept="image/*" onChange={handleFileSelect} required />
                {preview && <img src={preview} alt="preview" className="img-preview" />}
              </div>
              <input
                placeholder="Caption (optional)"
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />
              <div className="modal-actions">
                <button type="submit" className="btn-primary" disabled={uploading || !selectedFile}>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setShowUpload(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
