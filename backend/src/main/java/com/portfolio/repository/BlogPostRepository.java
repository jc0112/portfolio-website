package com.portfolio.repository;

import com.portfolio.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

    Optional<BlogPost> findBySlug(String slug);

    List<BlogPost> findByPublishedTrueOrderByCreatedAtDesc();

    List<BlogPost> findByTitleContainingIgnoreCaseAndPublishedTrue(String title);

    @Query("SELECT p FROM BlogPost p JOIN p.tags t WHERE t.slug = :tagSlug AND p.published = true ORDER BY p.createdAt DESC")
    List<BlogPost> findByTagSlugAndPublishedTrue(@Param("tagSlug") String tagSlug);

    @Query("SELECT p FROM BlogPost p JOIN p.tags t WHERE t.id = :tagId AND p.published = true ORDER BY p.createdAt DESC")
    List<BlogPost> findByTagIdAndPublishedTrue(@Param("tagId") Long tagId);

    boolean existsBySlug(String slug);
}