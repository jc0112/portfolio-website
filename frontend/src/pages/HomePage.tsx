import { Link } from 'react-router-dom';

const TECH_STACK = [
  { category: 'Languages', items: ['Python', 'Java', 'TypeScript', 'Go', 'C/C++', 'SQL'] },
  { category: 'Frameworks', items: ['Spring Boot', 'React', 'Flask', 'Django', 'LangChain'] },
  { category: 'Databases', items: ['PostgreSQL', 'MongoDB', 'Redis', 'RabbitMQ', 'DynamoDB'] },
  { category: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'] },
];

export default function HomePage() {
  return (
    <div className="home-page">

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <p className="hero-greeting">Hi, I'm</p>
          <h1 className="hero-name">Jerry</h1>
          <p className="hero-title">Full-Stack Software Engineer</p>
          <p className="hero-subtitle">
            Master's student at Duke University building scalable backend systems,
            full-stack applications, and AI-powered tools.
          </p>
          <div className="hero-links">
            <a href="mailto:zhengyichenworks@gmail.com" className="btn-primary">Get In Touch</a>
            <Link to="/projects" className="btn-outline">View My Work</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="http://localhost:8080/uploads/home_pic.jpg" alt="Jerry Chen" />
        </div>
      </section>

      {/* About */}
      <section className="about-section">
        <h2>About Me</h2>
        <div className="about-content">
          <p>
            I'm a software engineer pursuing my Master of Engineering in ECE (Software Development)
            at Duke University. My experience spans backend systems, distributed architecture,
            and AI engineering — from building agentic RAG pipelines to designing
            scalable REST APIs and cloud data pipelines.
          </p>
          <p>
            I enjoy working across the full stack and have a strong interest in backend systems,
            cloud infrastructure, and applying AI to real engineering problems. When I'm not coding,
            I'm lifting, hiking, playing drums, or writing about what I'm learning.
          </p>
          <div className="about-details">
            <div className="about-detail-item">
              <span className="detail-label">Location</span>
              <span>Durham, NC</span>
            </div>
            <div className="about-detail-item">
              <span className="detail-label">Degree</span>
              <span>M.Eng ECE — Duke University</span>
            </div>
            <div className="about-detail-item">
              <span className="detail-label">Experience</span>
              <span>Nokia · Amazon Lab126 · Careverse Technology</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="tech-section">
        <h2>Tech Stack</h2>
        <div className="tech-grid">
          {TECH_STACK.map(group => (
            <div key={group.category} className="tech-group">
              <h3>{group.category}</h3>
              <div className="tech-badges">
                {group.items.map(item => (
                  <span key={item} className="tech-badge">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section">
        <h2>Let's Connect</h2>
        <p>I'm always open to new opportunities and interesting conversations.</p>
        <div className="contact-links">
          <a href="mailto:zhengyichenworks@gmail.com" className="contact-link">
            <span className="contact-icon">✉</span> zhengyichenworks@gmail.com
          </a>
          <a href="https://github.com/jc0112" target="_blank" rel="noopener noreferrer" className="contact-link">
            <span className="contact-icon">⌥</span> github.com/jc0112
          </a>
          <a href="https://linkedin.com/in/jc2001" target="_blank" rel="noopener noreferrer" className="contact-link">
            <span className="contact-icon">in</span> linkedin.com/in/jc2001
          </a>
        </div>
      </section>

    </div>
  );
}