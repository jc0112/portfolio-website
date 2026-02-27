package com.portfolio.controller;

import com.portfolio.model.Tag;
import com.portfolio.service.TagService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tags")
@CrossOrigin(origins = "*")
public class TagController {

    private final TagService tagService;

    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    /**
     * Get all tags
     */
    @GetMapping
    public ResponseEntity<List<Tag>> getAllTags() {
        return ResponseEntity.ok(tagService.getAllTags());
    }

    /**
     * Get tag by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Tag> getTagById(@PathVariable Long id) {
        return tagService.getTagById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get tag by slug
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<Tag> getTagBySlug(@PathVariable String slug) {
        return tagService.getTagBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create new tag (owner only)
     */
    @PostMapping
    public ResponseEntity<Tag> createTag(@RequestBody Map<String, String> payload) {
        try {
            String name = payload.get("name");
            Tag tag = tagService.createTag(name);
            return ResponseEntity.status(HttpStatus.CREATED).body(tag);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update tag (owner only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<Tag> updateTag(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String newName = payload.get("name");
            Tag tag = tagService.updateTag(id, newName);
            return ResponseEntity.ok(tag);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Delete tag (owner only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        try {
            tagService.deleteTag(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}