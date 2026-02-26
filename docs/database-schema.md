# Database Schema Design

## Overview
PostgreSQL database schema for portfolio website with Blog, Gallery, and Projects features.

---

## Tables

### 1. **users**
Stores owner account information (only one user - you)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | User ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Login username |
| password | VARCHAR(255) | NOT NULL | Hashed password (BCrypt) |
| email | VARCHAR(100) | UNIQUE | Contact email |
| full_name | VARCHAR(100) | | Display name |
| bio | TEXT | | Short bio for homepage |
| avatar_url | VARCHAR(500) | | Profile picture URL |
| github_url | VARCHAR(255) | | GitHub profile link |
| linkedin_url | VARCHAR(255) | | LinkedIn profile link |
| created_at | TIMESTAMP | DEFAULT NOW() | Account creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

---

### 2. **blog_posts**
Stores blog articles

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Post ID |
| title | VARCHAR(255) | NOT NULL | Post title |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| content | TEXT | NOT NULL | Markdown content |
| excerpt | TEXT | | Short summary (optional) |
| published | BOOLEAN | DEFAULT FALSE | Published status |
| view_count | INTEGER | DEFAULT 0 | Number of views |
| author_id | BIGINT | FK → users(id) | Post author |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_blog_posts_slug` on `slug`
- `idx_blog_posts_published` on `published`
- `idx_blog_posts_created_at` on `created_at DESC`

---

### 3. **tags**
Stores blog post tags

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Tag ID |
| name | VARCHAR(50) | UNIQUE, NOT NULL | Tag name |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | URL-friendly tag |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Indexes:**
- `idx_tags_slug` on `slug`

---

### 4. **post_tags**
Many-to-many relationship between posts and tags

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| post_id | BIGINT | FK → blog_posts(id), ON DELETE CASCADE | Post reference |
| tag_id | BIGINT | FK → tags(id), ON DELETE CASCADE | Tag reference |

**Primary Key:** Composite key on `(post_id, tag_id)`

**Indexes:**
- `idx_post_tags_post` on `post_id`
- `idx_post_tags_tag` on `tag_id`

---

### 5. **comments**
Stores anonymous comments on blog posts

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Comment ID |
| content | TEXT | NOT NULL | Comment text |
| anonymous_name | VARCHAR(50) | NOT NULL | Random name (e.g., "Anonymous Penguin") |
| post_id | BIGINT | FK → blog_posts(id), ON DELETE CASCADE | Associated post |
| created_at | TIMESTAMP | DEFAULT NOW() | Comment time |

**Indexes:**
- `idx_comments_post_id` on `post_id`
- `idx_comments_created_at` on `created_at DESC`

---

### 6. **gallery_images**
Stores gallery photos

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Image ID |
| image_url | VARCHAR(500) | NOT NULL | Image file path/URL |
| thumbnail_url | VARCHAR(500) | | Thumbnail version (optional) |
| caption | TEXT | | Image caption |
| display_order | INTEGER | DEFAULT 0 | Order in gallery |
| uploaded_at | TIMESTAMP | DEFAULT NOW() | Upload time |

**Indexes:**
- `idx_gallery_display_order` on `display_order`
- `idx_gallery_uploaded_at` on `uploaded_at DESC`

---

### 7. **projects**
Stores portfolio projects

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Project ID |
| title | VARCHAR(255) | NOT NULL | Project name |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| description | TEXT | NOT NULL | Project description (markdown) |
| thumbnail_url | VARCHAR(500) | | Project thumbnail image |
| demo_video_url | VARCHAR(500) | | Demo video URL (YouTube, Vimeo, etc.) |
| github_url | VARCHAR(500) | | GitHub repository link |
| live_url | VARCHAR(500) | | Live demo URL (optional) |
| technologies | TEXT | | Tech stack (JSON array or comma-separated) |
| display_order | INTEGER | DEFAULT 0 | Display order |
| featured | BOOLEAN | DEFAULT FALSE | Featured project flag |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:**
- `idx_projects_slug` on `slug`
- `idx_projects_display_order` on `display_order`
- `idx_projects_featured` on `featured`

---

### 8. **likes** (Optional - for future)
Stores anonymous likes on posts/images/projects

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGSERIAL | PRIMARY KEY | Like ID |
| entity_type | VARCHAR(20) | NOT NULL | Type: 'POST', 'IMAGE', 'PROJECT' |
| entity_id | BIGINT | NOT NULL | ID of liked entity |
| anonymous_name | VARCHAR(50) | NOT NULL | Random anonymous name |
| ip_hash | VARCHAR(64) | | Hashed IP (to prevent spam) |
| created_at | TIMESTAMP | DEFAULT NOW() | Like time |

**Indexes:**
- `idx_likes_entity` on `(entity_type, entity_id)`
- `idx_likes_ip_entity` on `(ip_hash, entity_type, entity_id)` (prevent duplicate likes)

---

## Relationships

```
users (1) ──< (many) blog_posts
blog_posts (many) ──< (many) tags  [via post_tags]
blog_posts (1) ──< (many) comments

All tables are independent:
- gallery_images (standalone)
- projects (standalone)
- likes (polymorphic - can reference any entity)
```

---

## Notes

1. **Timestamps**: All tables use `created_at` and `updated_at` where relevant
2. **Soft Deletes**: Not implemented initially (can add `deleted_at` column later if needed)
3. **File Storage**: Image URLs point to files stored locally or cloud storage (S3, Cloudinary, etc.)
4. **Anonymous Names**: Generated server-side using a list of adjectives + animals
5. **Slugs**: Auto-generated from titles for SEO-friendly URLs
6. **Technologies Field**: Stored as JSON or comma-separated for simplicity (can normalize later)

---

## Sample Data Types

### Anonymous Names Pattern:
- `Anonymous Penguin`
- `Silent Koala`
- `Mysterious Dolphin`
- `Hidden Panda`

### Technologies Format (JSON):
```json
["React", "TypeScript", "Spring Boot", "PostgreSQL"]
```