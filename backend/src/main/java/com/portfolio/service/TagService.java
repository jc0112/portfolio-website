package com.portfolio.service;

import com.portfolio.model.Tag;
import com.portfolio.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TagService {

    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    /**
     * Get all tags
     */
    @Transactional(readOnly = true)
    public List<Tag> getAllTags() {
        return tagRepository.findAll();
    }

    /**
     * Get tag by ID
     */
    @Transactional(readOnly = true)
    public Optional<Tag> getTagById(Long id) {
        return tagRepository.findById(id);
    }

    /**
     * Get tag by slug
     */
    @Transactional(readOnly = true)
    public Optional<Tag> getTagBySlug(String slug) {
        return tagRepository.findBySlug(slug);
    }

    /**
     * Get tag by name
     */
    @Transactional(readOnly = true)
    public Optional<Tag> getTagByName(String name) {
        return tagRepository.findByName(name);
    }

    /**
     * Create new tag
     */
    public Tag createTag(String name) {
        if (tagRepository.existsByName(name)) {
            throw new IllegalArgumentException("Tag already exists");
        }

        Tag tag = new Tag();
        tag.setName(name);
        tag.setSlug(generateSlug(name));

        // Ensure slug is unique
        String originalSlug = tag.getSlug();
        int counter = 1;
        while (tagRepository.existsBySlug(tag.getSlug())) {
            tag.setSlug(originalSlug + "-" + counter);
            counter++;
        }

        return tagRepository.save(tag);
    }

    /**
     * Update tag
     */
    public Tag updateTag(Long id, String newName) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tag not found"));

        if (!tag.getName().equals(newName)) {
            if (tagRepository.existsByName(newName)) {
                throw new IllegalArgumentException("Tag name already exists");
            }
            tag.setName(newName);
            tag.setSlug(generateSlug(newName));
        }

        return tagRepository.save(tag);
    }

    /**
     * Delete tag
     */
    public void deleteTag(Long id) {
        if (!tagRepository.existsById(id)) {
            throw new IllegalArgumentException("Tag not found");
        }
        tagRepository.deleteById(id);
    }

    /**
     * Generate URL-friendly slug from name
     */
    private String generateSlug(String text) {
        return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}