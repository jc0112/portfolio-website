import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { AuthProvider, useAuth } from './context/AuthContext';
import { authApi } from './services/api';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import GalleryPage from './pages/GalleryPage';
import './App.css';

function NavBar() {
  const { isOwner, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await authApi.login(username.trim(), password.trim());
      // AuthContext.login is called via the token stored in localStorage
      localStorage.setItem('token', res.data.token);
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">Jerry Chen</Link>
          <ul className="nav-menu">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
          </ul>
          <div className="nav-auth">
            {isOwner ? (
              <button className="btn-secondary" onClick={logout}>Logout</button>
            ) : (
              <button className="btn-secondary" onClick={() => setShowLogin(true)}>Owner Login</button>
            )}
          </div>
        </div>
      </nav>

      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Owner Login</h2>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && <p className="form-error">{error}</p>}
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Login</button>
                <button type="button" className="btn-secondary" onClick={() => setShowLogin(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <NavBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
            </Routes>
          </main>
          <footer className="footer">
            <div className="footer-social">
              <a href="https://github.com/jc0112" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
              <a href="https://linkedin.com/in/jc2001" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://instagram.com/realjmouse2001" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            </div>
            <p>&copy; 2026 Jerry Chen</p>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;