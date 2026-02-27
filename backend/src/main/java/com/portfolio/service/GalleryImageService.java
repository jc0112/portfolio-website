package com.portfolio.service;

import com.portfolio.model.GalleryImage;
import com.portfolio.repository.GalleryImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class GalleryImageService {

    private final GalleryImageRepository galleryImageRepository;

    public GalleryImageService(GalleryImageRepository galleryImageRepository) {
        this.galleryImageRepository = galleryImageRepository;
    }

    /**
     * Get all gallery images ordered by display order
     */
    @Transactional(readOnly = true)
    public List<GalleryImage> getAllImages() {
        return galleryImageRepository.findAllByOrderByDisplayOrderAsc();
    }

    /**
     * Get all gallery images ordered by upload date (newest first)
     */
    @Transactional(readOnly = true)
    public List<GalleryImage> getAllImagesByUploadDate() {
        return galleryImageRepository.findAllByOrderByUploadedAtDesc();
    }

    /**
     * Get image by ID
     */
    @Transactional(readOnly = true)
    public Optional<GalleryImage> getImageById(Long id) {
        return galleryImageRepository.findById(id);
    }

    /**
     * Upload new image
     */
    public GalleryImage uploadImage(String imageUrl, String thumbnailUrl, String caption) {
        GalleryImage image = new GalleryImage();
        image.setImageUrl(imageUrl);
        image.setThumbnailUrl(thumbnailUrl);
        image.setCaption(caption);

        // Set display order as last
        long count = galleryImageRepository.count();
        image.setDisplayOrder((int) count + 1);

        return galleryImageRepository.save(image);
    }

    /**
     * Upload image with existing GalleryImage object
     */
    public GalleryImage uploadImage(GalleryImage image) {
        // Set default display order if not specified
        if (image.getDisplayOrder() == null || image.getDisplayOrder() == 0) {
            long count = galleryImageRepository.count();
            image.setDisplayOrder((int) count + 1);
        }

        return galleryImageRepository.save(image);
    }

    /**
     * Update image caption
     */
    public GalleryImage updateCaption(Long id, String caption) {
        GalleryImage image = galleryImageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
        image.setCaption(caption);
        return galleryImageRepository.save(image);
    }

    /**
     * Update display order
     */
    public GalleryImage updateDisplayOrder(Long id, int newOrder) {
        GalleryImage image = galleryImageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
        image.setDisplayOrder(newOrder);
        return galleryImageRepository.save(image);
    }

    /**
     * Delete image
     */
    public void deleteImage(Long id) {
        if (!galleryImageRepository.existsById(id)) {
            throw new IllegalArgumentException("Image not found");
        }
        // TODO: Also delete the actual image file from storage
        galleryImageRepository.deleteById(id);
    }

    /**
     * Reorder images - batch update display orders
     */
    public void reorderImages(List<Long> imageIds) {
        for (int i = 0; i < imageIds.size(); i++) {
            Long imageId = imageIds.get(i);
            final int displayOrder = i + 1;
            galleryImageRepository.findById(imageId).ifPresent(image -> {
                image.setDisplayOrder(displayOrder);
                galleryImageRepository.save(image);
            });
        }
    }
}