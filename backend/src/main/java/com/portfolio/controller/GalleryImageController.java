package com.portfolio.controller;

import com.portfolio.model.GalleryImage;
import com.portfolio.service.GalleryImageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "*")
public class GalleryImageController {

    private final GalleryImageService galleryImageService;

    public GalleryImageController(GalleryImageService galleryImageService) {
        this.galleryImageService = galleryImageService;
    }

    /**
     * Get all images ordered by display order
     */
    @GetMapping
    public ResponseEntity<List<GalleryImage>> getAllImages(@RequestParam(required = false) String sort) {
        if ("date".equalsIgnoreCase(sort)) {
            return ResponseEntity.ok(galleryImageService.getAllImagesByUploadDate());
        }
        return ResponseEntity.ok(galleryImageService.getAllImages());
    }

    /**
     * Get image by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<GalleryImage> getImageById(@PathVariable Long id) {
        return galleryImageService.getImageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Upload new image (owner only)
     */
    @PostMapping
    public ResponseEntity<GalleryImage> uploadImage(@RequestBody GalleryImage image) {
        try {
            GalleryImage uploadedImage = galleryImageService.uploadImage(image);
            return ResponseEntity.status(HttpStatus.CREATED).body(uploadedImage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Update image caption (owner only)
     */
    @PatchMapping("/{id}/caption")
    public ResponseEntity<GalleryImage> updateCaption(@PathVariable Long id, @RequestParam String caption) {
        try {
            GalleryImage image = galleryImageService.updateCaption(id, caption);
            return ResponseEntity.ok(image);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Update display order (owner only)
     */
    @PatchMapping("/{id}/display-order")
    public ResponseEntity<GalleryImage> updateDisplayOrder(@PathVariable Long id, @RequestParam int order) {
        try {
            GalleryImage image = galleryImageService.updateDisplayOrder(id, order);
            return ResponseEntity.ok(image);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Batch reorder images (owner only)
     */
    @PutMapping("/reorder")
    public ResponseEntity<Void> reorderImages(@RequestBody List<Long> imageIds) {
        try {
            galleryImageService.reorderImages(imageIds);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Delete image (owner only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        try {
            galleryImageService.deleteImage(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}