import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { blogApi, commentsApi } from '../services/api';
import type { BlogPost, Comment } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isOwner } = useAuth();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await blogApi.getBySlug(slug!);
        setPost(res.data);
        const commentsRes = await commentsApi.getByPostId(res.data.id);
        setComments(commentsRes.data);
      } catch {
        navigate('/blog');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const res = await commentsApi.create(post!.id, commentText.trim());
      setComments(prev => [...prev, res.data]);
      setCommentText('');
    } catch {
      alert('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!confirm('Delete this comment?')) return;
    await commentsApi.delete(id);
    setComments(prev => prev.filter(c => c.id !== id));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!post) return null;

  return (
    <div className="post-detail">
      <div className="post-detail-header">
        <Link to="/blog" className="back-link">← Back to Blog</Link>
        <div className="post-detail-meta">
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span>{post.viewCount} views</span>
          {!post.published && <span className="draft-badge">Draft</span>}
        </div>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="post-detail-excerpt">{post.excerpt}</p>}
      </div>

      <div className="post-detail-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match && !String(children).includes('\n');
              return isInline ? (
                <code className={className} {...props}>{children}</code>
              ) : (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match ? match[1] : 'text'}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      <div className="comments-section">
        <h2>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h2>

        <form className="comment-form" onSubmit={handleComment}>
          <textarea
            placeholder="Leave a comment... (you'll get a random anonymous name)"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            rows={3}
          />
          <button type="submit" className="btn-primary" disabled={submitting || !commentText.trim()}>
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        <div className="comments-list">
          {comments.length === 0 && (
            <p className="empty-state" style={{ padding: '1.5rem 0' }}>No comments yet. Be the first!</p>
          )}
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.anonymousName}</span>
                <span className="comment-date">
                  {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {isOwner && (
                  <button className="comment-delete-btn" onClick={() => handleDeleteComment(comment.id)}>
                    Delete
                  </button>
                )}
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}