package com.portfolio.controller;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    @Value("${app.gcs.bucket}")
    private String bucketName;

    @Value("${app.gcs.enabled:false}")
    private boolean gcsEnabled;

    // Local upload fallback
    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Value("${app.base-url}")
    private String baseUrl;

    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (gcsEnabled) {
            return uploadToGcs(file);
        } else {
            return uploadLocally(file);
        }
    }

    private ResponseEntity<?> uploadToGcs(MultipartFile file) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = "uploads/" + UUID.randomUUID() + extension;

        Storage storage = StorageOptions.getDefaultInstance().getService();
        BlobId blobId = BlobId.of(bucketName, filename);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();
        storage.create(blobInfo, file.getBytes());

        String fileUrl = "https://storage.googleapis.com/" + bucketName + "/" + filename;
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }

    private ResponseEntity<?> uploadLocally(MultipartFile file) throws IOException {
        java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir).toAbsolutePath();
        if (!java.nio.file.Files.exists(uploadPath)) {
            java.nio.file.Files.createDirectories(uploadPath);
        }
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID() + extension;
        java.nio.file.Files.copy(file.getInputStream(), uploadPath.resolve(filename));
        return ResponseEntity.ok(Map.of("url", baseUrl + "/uploads/" + filename));
    }
}