-- Sample Data for Portfolio Website

-- 1. Insert Owner User
INSERT INTO users (username, password, email, full_name, bio, github_url, linkedin_url, avatar_url, created_at, updated_at)
VALUES ('admin', 'password123', 'your.email@example.com', 'John Doe',
        'Full-stack software engineer passionate about building scalable applications. Experienced in Java, Spring Boot, React, and cloud technologies.',
        'https://github.com/yourusername', 'https://linkedin.com/in/yourusername',
        'https://via.placeholder.com/150', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 2. Insert Tags
INSERT INTO tags (name, slug, created_at)
VALUES ('Java', 'java', CURRENT_TIMESTAMP),
       ('React', 'react', CURRENT_TIMESTAMP),
       ('Career', 'career', CURRENT_TIMESTAMP),
       ('Tutorial', 'tutorial', CURRENT_TIMESTAMP),
       ('Tech Memo', 'tech-memo', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 3. Insert Blog Posts
INSERT INTO blog_posts (title, slug, content, excerpt, published, view_count, author_id, created_at, updated_at)
VALUES
    ('Getting Started with Spring Boot', 'getting-started-with-spring-boot',
     '# Getting Started with Spring Boot

Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications.

## Key Features

- Auto-configuration
- Embedded servers
- Production-ready features

```java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```',
     'Learn how to get started with Spring Boot and build your first application.',
     true, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('React Hooks Deep Dive', 'react-hooks-deep-dive',
     '# React Hooks Deep Dive

Hooks are a game-changer in React development.

## useState

The most commonly used hook for state management.

```javascript
const [count, setCount] = useState(0);
```

## useEffect

Handle side effects in your components.

```javascript
useEffect(() => {
    document.title = `Count: ${count}`;
}, [count]);
```',
     'A comprehensive guide to React Hooks and how to use them effectively.',
     true, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('My Software Engineering Journey', 'my-software-engineering-journey',
     '# My Software Engineering Journey

Reflecting on my path from beginner to professional developer.

## The Beginning

I started coding in college, building simple web applications...

## Current Focus

These days I''m focused on:
- Building scalable backend systems
- Creating intuitive user interfaces
- Learning cloud architecture',
     'Personal reflections on my journey as a software engineer.',
     true, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Quick Tip: PostgreSQL JSON Queries', 'postgresql-json-queries',
     '# Quick Tip: PostgreSQL JSON Queries

Working with JSONB in PostgreSQL is powerful!

```sql
SELECT * FROM projects WHERE technologies @> ''[\"React\"]'';
```

This query finds all projects that use React.',
     'Quick memo on querying JSONB columns in PostgreSQL.',
     true, 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 4. Link Posts to Tags
INSERT INTO post_tags (post_id, tag_id)
VALUES
    (1, 1), -- Getting Started with Spring Boot -> Java
    (1, 4), -- Getting Started with Spring Boot -> Tutorial
    (2, 2), -- React Hooks Deep Dive -> React
    (2, 4), -- React Hooks Deep Dive -> Tutorial
    (3, 3), -- My Software Engineering Journey -> Career
    (4, 5)  -- PostgreSQL JSON Queries -> Tech Memo
ON CONFLICT DO NOTHING;

-- 5. Insert Comments
INSERT INTO comments (content, anonymous_name, post_id, created_at)
VALUES
    ('Great tutorial! This helped me understand Spring Boot much better.', 'Anonymous Penguin', 1, CURRENT_TIMESTAMP),
    ('Can you do a tutorial on Spring Security next?', 'Silent Koala', 1, CURRENT_TIMESTAMP),
    ('React Hooks completely changed how I write components. Great explanation!', 'Mysterious Dolphin', 2, CURRENT_TIMESTAMP),
    ('Inspiring journey! Keep up the great work.', 'Hidden Panda', 3, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 6. Insert Projects
INSERT INTO projects (title, slug, description, technologies, github_url, live_url, demo_video_url, thumbnail_url, display_order, featured, created_at, updated_at)
VALUES
    ('E-Commerce Platform', 'ecommerce-platform',
     'A full-stack e-commerce platform built with modern technologies. Features include user authentication, product catalog, shopping cart, and payment integration.',
     '["React", "TypeScript", "Spring Boot", "PostgreSQL", "Docker"]',
     'https://github.com/yourusername/ecommerce-platform',
     'https://demo.ecommerce-platform.com',
     'https://youtube.com/watch?v=example1',
     'https://via.placeholder.com/400x300',
     1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Task Management App', 'task-management-app',
     'A collaborative task management application with real-time updates. Users can create boards, lists, and cards to organize their work.',
     '["React", "Node.js", "MongoDB", "WebSocket", "Redux"]',
     'https://github.com/yourusername/task-app',
     NULL,
     'https://youtube.com/watch?v=example2',
     'https://via.placeholder.com/400x300',
     2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('Weather Dashboard', 'weather-dashboard',
     'A responsive weather dashboard that displays current weather and forecasts. Integrates with multiple weather APIs for accurate data.',
     '["React", "TypeScript", "Tailwind CSS", "REST API"]',
     'https://github.com/yourusername/weather-dashboard',
     'https://weather-dashboard-demo.com',
     NULL,
     'https://via.placeholder.com/400x300',
     3, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 7. Insert Gallery Images
INSERT INTO gallery_images (image_url, thumbnail_url, caption, display_order, uploaded_at)
VALUES
    ('https://via.placeholder.com/800x600', 'https://via.placeholder.com/400x300',
     'Deadlift PR - 405 lbs! 💪 Finally hit that 4-plate milestone.', 1, CURRENT_TIMESTAMP),
    ('https://via.placeholder.com/800x600', 'https://via.placeholder.com/400x300',
     'Hiking in Yosemite National Park 🏔️ Amazing views!', 2, CURRENT_TIMESTAMP),
    ('https://via.placeholder.com/800x600', 'https://via.placeholder.com/400x300',
     'Completed my first marathon! 26.2 miles 🏃‍♂️', 3, CURRENT_TIMESTAMP),
    ('https://via.placeholder.com/800x600', 'https://via.placeholder.com/400x300',
     'Coffee and code ☕ Perfect weekend morning.', 4, CURRENT_TIMESTAMP),
    ('https://via.placeholder.com/800x600', 'https://via.placeholder.com/400x300',
     'Team hackathon - we won first place! 🏆', 5, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;