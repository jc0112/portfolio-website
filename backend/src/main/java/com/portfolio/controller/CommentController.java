package com.portfolio.controller;

import com.portfolio.model.Comment;
import com.portfolio.service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "*")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    /**
     * Get all comments for a post
     */
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    /**
     * Get comment count for a post
     */
    @GetMapping("/post/{postId}/count")
    public ResponseEntity<Map<String, Long>> getCommentCount(@PathVariable Long postId) {
        Long count = commentService.getCommentCount(postId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * Create new comment (anonymous - anyone can comment)
     */
    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody Map<String, Object> payload) {
        try {
            Long postId = ((Number) payload.get("postId")).longValue();
            String content = (String) payload.get("content");

            Comment comment = commentService.createComment(postId, content);
            return ResponseEntity.status(HttpStatus.CREATED).body(comment);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Delete comment (owner only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteComment(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}