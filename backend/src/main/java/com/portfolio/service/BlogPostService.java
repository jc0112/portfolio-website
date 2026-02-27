package com.portfolio.service;

import com.portfolio.model.BlogPost;
import com.portfolio.model.Tag;
import com.portfolio.model.User;
import com.portfolio.repository.BlogPostRepository;
import com.portfolio.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final TagRepository tagRepository;

    public BlogPostService(BlogPostRepository blogPostRepository, TagRepository tagRepository) {
        this.blogPostRepository = blogPostRepository;
        this.tagRepository = tagRepository;
    }

    /**
     * Get all published blog posts
     */
    @Transactional(readOnly = true)
    public List<BlogPost> getAllPublishedPosts() {
        return blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc();
    }

    /**
     * Get all posts (including unpublished) - owner only
     */
    @Transactional(readOnly = true)
    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findAll();
    }

    /**
     * Get post by ID
     */
    @Transactional(readOnly = true)
    public Optional<BlogPost> getPostById(Long id) {
        return blogPostRepository.findById(id);
    }

    /**
     * Get post by slug
     */
    @Transactional(readOnly = true)
    public Optional<BlogPost> getPostBySlug(String slug) {
        return blogPostRepository.findBySlug(slug);
    }

    /**
     * Search posts by title
     */
    @Transactional(readOnly = true)
    public List<BlogPost> searchPostsByTitle(String title) {
        return blogPostRepository.findByTitleContainingIgnoreCaseAndPublishedTrue(title);
    }

    /**
     * Get posts by tag
     */
    @Transactional(readOnly = true)
    public List<BlogPost> getPostsByTag(String tagSlug) {
        return blogPostRepository.findByTagSlugAndPublishedTrue(tagSlug);
    }

    /**
     * Create new blog post
     */
    public BlogPost createPost(BlogPost post, User author, Set<String> tagNames) {
        // Generate slug from title
        post.setSlug(generateSlug(post.getTitle()));

        // Ensure slug is unique
        String originalSlug = post.getSlug();
        int counter = 1;
        while (blogPostRepository.existsBySlug(post.getSlug())) {
            post.setSlug(originalSlug + "-" + counter);
            counter++;
        }

        post.setAuthor(author);
        post.setViewCount(0);

        // Add tags
        if (tagNames != null && !tagNames.isEmpty()) {
            for (String tagName : tagNames) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            newTag.setSlug(generateSlug(tagName));
                            return tagRepository.save(newTag);
                        });
                post.addTag(tag);
            }
        }

        return blogPostRepository.save(post);
    }

    /**
     * Update existing blog post
     */
    public BlogPost updatePost(Long id, BlogPost updatedPost, Set<String> tagNames) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        // Update fields
        if (updatedPost.getTitle() != null && !updatedPost.getTitle().equals(post.getTitle())) {
            post.setTitle(updatedPost.getTitle());
            // Regenerate slug if title changed
            String newSlug = generateSlug(updatedPost.getTitle());
            if (!newSlug.equals(post.getSlug()) && !blogPostRepository.existsBySlug(newSlug)) {
                post.setSlug(newSlug);
            }
        }

        if (updatedPost.getContent() != null) {
            post.setContent(updatedPost.getContent());
        }

        if (updatedPost.getExcerpt() != null) {
            post.setExcerpt(updatedPost.getExcerpt());
        }

        if (updatedPost.getPublished() != null) {
            post.setPublished(updatedPost.getPublished());
        }

        // Update tags
        if (tagNames != null) {
            post.getTags().clear();
            for (String tagName : tagNames) {
                Tag tag = tagRepository.findByName(tagName)
                        .orElseGet(() -> {
                            Tag newTag = new Tag();
                            newTag.setName(tagName);
                            newTag.setSlug(generateSlug(tagName));
                            return tagRepository.save(newTag);
                        });
                post.addTag(tag);
            }
        }

        return blogPostRepository.save(post);
    }

    /**
     * Delete blog post
     */
    public void deletePost(Long id) {
        if (!blogPostRepository.existsById(id)) {
            throw new IllegalArgumentException("Post not found");
        }
        blogPostRepository.deleteById(id);
    }

    /**
     * Publish or unpublish a post
     */
    public BlogPost togglePublish(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        post.setPublished(!post.getPublished());
        return blogPostRepository.save(post);
    }

    /**
     * Increment view count
     */
    public void incrementViewCount(Long id) {
        blogPostRepository.findById(id).ifPresent(post -> {
            post.setViewCount(post.getViewCount() + 1);
            blogPostRepository.save(post);
        });
    }

    /**
     * Generate URL-friendly slug from title
     */
    private String generateSlug(String text) {
        return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")  // Remove special characters
                .replaceAll("\\s+", "-")           // Replace spaces with hyphens
                .replaceAll("-+", "-")             // Replace multiple hyphens with single
                .replaceAll("^-|-$", "");          // Remove leading/trailing hyphens
    }
}