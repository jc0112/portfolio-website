import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const EXPERIENCE = [
  {
    company: 'Nokia',
    date: 'Jan 2025 – Present',
    role: 'Sunnyvale · Test framework migration, RAGnarok AI hub',
    tags: ['Python', 'LLMs'],
  },
  {
    company: 'Amazon Lab126',
    date: 'Summer 2024',
    role: 'Radar movement detection systems',
    tags: ['Embedded', 'C++'],
  },
  {
    company: 'Careverse Technology',
    date: '2023',
    role: 'Medical imaging DICOM pipeline',
    tags: ['Go', 'Backend'],
  },
];

const TECH_STACK = [
  { category: 'Languages', items: ['Python', 'Java', 'TypeScript', 'Go', 'C/C++', 'SQL'] },
  { category: 'Frameworks', items: ['Spring Boot', 'React', 'Flask', 'Django', 'LangChain'] },
  { category: 'Databases', items: ['PostgreSQL', 'MongoDB', 'Redis', 'RabbitMQ', 'DynamoDB'] },
  { category: 'Cloud & DevOps', items: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'] },
];

function FadeInSection({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-section${visible ? ' visible' : ''}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="home-page">

      {/* Hero */}
      <section className="hero">
        <div className="hero-role-label">Software Engineer</div>

        <div className="hero-left">
          <div className="hero-title-block">
            <h1 className="hero-title">Hello</h1>
            <p className="hero-subtitle">It's Jerry Chen, a software engineer</p>
          </div>

          <div className="hero-scroll">
            <div className="hero-scroll-arrow">↓</div>
            <span>Scroll down</span>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="https://storage.googleapis.com/jerry-portfolio-uploads/uploads/home_pic.jpg"
            alt="Jerry Chen"
          />
        </div>
      </section>

      <div className="section-divider" />

      {/* About */}
      <FadeInSection className="about-section">
        <div className="about-col-text">
          <h2 className="about-heading">About<br />Me</h2>
          <p className="about-body">
            I build reliable backend systems, developer tools, and AI-powered applications.
            Currently at Nokia, crafting test frameworks and LLM-powered knowledge systems.
          </p>
        </div>

        <div className="about-bullets">
          <div className="about-bullet">
            <div className="bullet-dot">
              <svg viewBox="0 0 8 8" fill="none">
                <path d="M2 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span>MS ECE at Duke University, graduating May 2026. Background in backend, systems, and AI integration.</span>
          </div>
          <div className="about-bullet">
            <div className="bullet-dot">
              <svg viewBox="0 0 8 8" fill="none">
                <path d="M2 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span>Experience across Nokia, Amazon Lab126, and Careverse Technology — from radar systems to DICOM pipelines.</span>
          </div>
        </div>
      </FadeInSection>

      <div className="section-divider" />

      {/* Experience */}
      <FadeInSection className="exp-section">
        <div className="section-header">
          <div className="section-dot" />
          <span className="section-label">Experience</span>
        </div>
        {EXPERIENCE.map((item, i) => (
          <div key={i} className="exp-row">
            <div className="exp-col-left">
              <div className="exp-company">{item.company}</div>
              <div className="exp-date">{item.date}</div>
            </div>
            <div className="exp-role">{item.role}</div>
            <div className="exp-tags">
              {item.tags.map(tag => <span key={tag} className="exp-tag">{tag}</span>)}
            </div>
          </div>
        ))}
      </FadeInSection>

      <div className="section-divider" />

      {/* Tech Stack */}
      <FadeInSection className="tech-section">
        <div className="section-header">
          <div className="section-dot" />
          <span className="section-label">Tech Stack</span>
        </div>
        <div className="tech-grid">
          {TECH_STACK.map(group => (
            <div key={group.category} className="tech-group">
              <h3 className="tech-group-label">{group.category}</h3>
              <div className="tech-badges">
                {group.items.map(item => (
                  <span key={item} className="tech-badge">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FadeInSection>

    </div>
  );
}
