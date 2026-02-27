package com.portfolio.controller;

import com.portfolio.model.BlogPost;
import com.portfolio.model.User;
import com.portfolio.service.BlogPostService;
import com.portfolio.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class BlogPostController {

    private final BlogPostService blogPostService;
    private final UserService userService;

    public BlogPostController(BlogPostService blogPostService, UserService userService) {
        this.blogPostService = blogPostService;
        this.userService = userService;
    }

    /**
     * Get all published posts
     */
    @GetMapping
    public ResponseEntity<List<BlogPost>> getAllPublishedPosts() {
        return ResponseEntity.ok(blogPostService.getAllPublishedPosts());
    }

    /**
     * Get all posts including unpublished (owner only)
     */
    @GetMapping("/all")
    public ResponseEntity<List<BlogPost>> getAllPosts() {
        // TODO: Add authentication check for owner
        return ResponseEntity.ok(blogPostService.getAllPosts());
    }

    /**
     * Get post by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<BlogPost> getPostById(@PathVariable Long id) {
        return blogPostService.getPostById(id)
                .map(post -> {
                    blogPostService.incrementViewCount(id);
                    return ResponseEntity.ok(post);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get post by slug
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<BlogPost> getPostBySlug(@PathVariable String slug) {
        return blogPostService.getPostBySlug(slug)
                .map(post -> {
                    blogPostService.incrementViewCount(post.getId());
                    return ResponseEntity.ok(post);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Search posts by title
     */
    @GetMapping("/search")
    public ResponseEntity<List<BlogPost>> searchPosts(@RequestParam String title) {
        return ResponseEntity.ok(blogPostService.searchPostsByTitle(title));
    }

    /**
     * Get posts by tag
     */
    @GetMapping("/tag/{tagSlug}")
    public ResponseEntity<List<BlogPost>> getPostsByTag(@PathVariable String tagSlug) {
        return ResponseEntity.ok(blogPostService.getPostsByTag(tagSlug));
    }

    /**
     * Create new post (owner only)
     */
    @PostMapping
    public ResponseEntity<BlogPost> createPost(@RequestBody Map<String, Object> payload) {
        try {
            // TODO: Get authenticated user instead of hardcoding
            User author = userService.getUserById(1L)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            BlogPost post = new BlogPost();
            post.setTitle((String) payload.get("title"));
            post.setContent((String) payload.get("content"));
            post.setExcerpt((String) payload.get("excerpt"));
            post.setPublished((Boolean) payload.getOrDefault("published", false));

            @SuppressWarnings("unchecked")
            List<String> tagNames = (List<String>) payload.get("tags");
            Set<String> tagSet = tagNames != null ? Set.copyOf(tagNames) : Set.of();

            BlogPost createdPost = blogPostService.createPost(post, author, tagSet);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update post (owner only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            BlogPost updatedPost = new BlogPost();
            updatedPost.setTitle((String) payload.get("title"));
            updatedPost.setContent((String) payload.get("content"));
            updatedPost.setExcerpt((String) payload.get("excerpt"));
            updatedPost.setPublished((Boolean) payload.get("published"));

            @SuppressWarnings("unchecked")
            List<String> tagNames = (List<String>) payload.get("tags");
            Set<String> tagSet = tagNames != null ? Set.copyOf(tagNames) : null;

            BlogPost updated = blogPostService.updatePost(id, updatedPost, tagSet);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Delete post (owner only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        try {
            blogPostService.deletePost(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Toggle publish status (owner only)
     */
    @PatchMapping("/{id}/toggle-publish")
    public ResponseEntity<BlogPost> togglePublish(@PathVariable Long id) {
        try {
            BlogPost post = blogPostService.togglePublish(id);
            return ResponseEntity.ok(post);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}