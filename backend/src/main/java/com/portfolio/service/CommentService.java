package com.portfolio.service;

import com.portfolio.model.BlogPost;
import com.portfolio.model.Comment;
import com.portfolio.repository.BlogPostRepository;
import com.portfolio.repository.CommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final BlogPostRepository blogPostRepository;
    private final Random random = new Random();

    // Lists for generating fun anonymous names (Google Docs style)
    private static final String[] ADJECTIVES = {
        "Anonymous", "Silent", "Mysterious", "Hidden", "Quiet", "Shy",
        "Curious", "Brave", "Swift", "Gentle", "Wise", "Happy",
        "Clever", "Bold", "Calm", "Bright", "Jolly", "Lucky"
    };

    private static final String[] ANIMALS = {
        "Penguin", "Koala", "Dolphin", "Panda", "Tiger", "Eagle",
        "Elephant", "Fox", "Wolf", "Bear", "Owl", "Rabbit",
        "Lion", "Deer", "Otter", "Hawk", "Seal", "Cheetah"
    };

    public CommentService(CommentRepository commentRepository, BlogPostRepository blogPostRepository) {
        this.commentRepository = commentRepository;
        this.blogPostRepository = blogPostRepository;
    }

    /**
     * Get all comments for a blog post
     */
    @Transactional(readOnly = true)
    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    /**
     * Get comment count for a post
     */
    @Transactional(readOnly = true)
    public Long getCommentCount(Long postId) {
        return commentRepository.countByPostId(postId);
    }

    /**
     * Create new comment with auto-generated anonymous name
     */
    public Comment createComment(Long postId, String content) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setAnonymousName(generateAnonymousName());

        return commentRepository.save(comment);
    }

    /**
     * Delete comment
     */
    public void deleteComment(Long id) {
        if (!commentRepository.existsById(id)) {
            throw new IllegalArgumentException("Comment not found");
        }
        commentRepository.deleteById(id);
    }

    /**
     * Generate a fun anonymous name (e.g., "Anonymous Penguin", "Silent Koala")
     */
    private String generateAnonymousName() {
        String adjective = ADJECTIVES[random.nextInt(ADJECTIVES.length)];
        String animal = ANIMALS[random.nextInt(ANIMALS.length)];
        return adjective + " " + animal;
    }
}