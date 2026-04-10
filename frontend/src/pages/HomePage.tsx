import { useRef, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

const EXPERIENCE = [
  {
    company: 'Nokia',
    date: 'Sep 2025 – Dec 2025',
    role: 'Software Engineer Co-op · Sunnyvale, CA · Python/pytest migration, agentic RAG pipelines, full-stack chatbot',
    tags: ['Python', 'LangChain', 'FastAPI', 'React'],
  },
  {
    company: 'Duke University',
    date: 'Jan 2025 – Sep 2025',
    role: 'Back-end Developer · Durham, NC · Code assessment platform for 2K+ students, SSO with Duke NetID OIDC',
    tags: ['Java', 'Spring Boot', 'Kubernetes'],
  },
  {
    company: 'Careverse Technology',
    date: 'Mar 2024 – Aug 2024',
    role: 'Software Engineer Intern · Beijing, China · DICOM pipeline, RabbitMQ consumer, medical imaging',
    tags: ['Go', 'Spring Boot', 'RabbitMQ'],
  },
  {
    company: 'Amazon Lab126',
    date: 'Jan 2023 – Jun 2023',
    role: 'Full-Stack Embedded Engineer · Seattle, WA · Radar movement detection, serverless AWS data pipeline',
    tags: ['Python', 'AWS', 'Embedded'],
  },
];

const TECH_STACK = [
  { category: 'Languages', items: ['Python', 'C', 'C++', 'Java', 'Go', 'SQL', 'JavaScript', 'TypeScript', 'Shell', 'HTML', 'CSS', 'Tcl'] },
  { category: 'Frameworks & Libraries', items: ['Django', 'Flask', 'Spring Boot', 'React', 'Bootstrap', 'LangChain', 'Pytest', 'Next.js'] },
  { category: 'Databases & Messaging', items: ['PostgreSQL', 'MongoDB', 'Redis', 'RabbitMQ', 'Qdrant', 'Kafka', 'DynamoDB'] },
  { category: 'Cloud & DevOps', items: ['AWS (EC2, S3, Lambda)', 'GCP (Firestore, Cloud SQL)', 'Docker', 'Kubernetes', 'CI/CD', 'Git', 'Linux'] },
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
            src="https://storage.googleapis.com/jerry-portfolio-uploads/uploads/test-photo.jpeg"
            // src="/test-photo.jpeg"
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
            I'm a software engineer finishing my Master's in ECE at Duke this May, with a background in electrical engineering and a few years of industry experience across backend, infrastructure, and applied AI.
            I like problems where the system design matters and the solution has to hold up in production — whether that's building RAG pipelines, scalable APIs, or data infrastructure.
            Open to full-time SWE roles starting May 2026 — backend, infra, or applied AI. US-based, open to relocation. Let's connect.
          </p>
        </div>

        <div className="about-bullets">
          <div className="about-bullet">
            <div className="bullet-dot">
              <svg viewBox="0 0 8 8" fill="none">
                <path d="M2 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span>B.S. EE at University of Washington (2023) — completed an industry capstone with Amazon Lab126 building radar movement detection systems.</span>
          </div>
          <div className="about-bullet">
            <div className="bullet-dot">
              <svg viewBox="0 0 8 8" fill="none">
                <path d="M2 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span>M.Eng ECE at Duke University (2026) — architected a code assessment platform handling 500+ daily submissions for 2,000+ students across 8 courses.</span>
          </div>
          <div className="about-bullet">
            <div className="bullet-dot">
              <svg viewBox="0 0 8 8" fill="none">
                <path d="M2 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span>Outside of work I'm a powerlifter — current SBD total is 1,070 lb (484 kg).</span>
          </div>
          <div className="about-bullet">
            <div className="bullet-dot">
              <svg viewBox="0 0 8 8" fill="none">
                <path d="M2 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span>Fun fact: originally from China, I came to the US as a high school exchange student and spent two years in a town of 400 people in South Dakota. That was quite the introduction to America.</span>
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
