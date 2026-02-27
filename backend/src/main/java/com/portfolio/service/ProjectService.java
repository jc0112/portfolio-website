package com.portfolio.service;

import com.portfolio.model.Project;
import com.portfolio.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * Get all projects ordered by display order
     */
    @Transactional(readOnly = true)
    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByDisplayOrderAsc();
    }

    /**
     * Get only featured projects
     */
    @Transactional(readOnly = true)
    public List<Project> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrueOrderByDisplayOrderAsc();
    }

    /**
     * Get project by ID
     */
    @Transactional(readOnly = true)
    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    /**
     * Get project by slug
     */
    @Transactional(readOnly = true)
    public Optional<Project> getProjectBySlug(String slug) {
        return projectRepository.findBySlug(slug);
    }

    /**
     * Create new project
     */
    public Project createProject(Project project) {
        // Generate slug from title
        project.setSlug(generateSlug(project.getTitle()));

        // Ensure slug is unique
        String originalSlug = project.getSlug();
        int counter = 1;
        while (projectRepository.existsBySlug(project.getSlug())) {
            project.setSlug(originalSlug + "-" + counter);
            counter++;
        }

        // Set default display order if not specified
        if (project.getDisplayOrder() == null || project.getDisplayOrder() == 0) {
            long count = projectRepository.count();
            project.setDisplayOrder((int) count + 1);
        }

        return projectRepository.save(project);
    }

    /**
     * Update existing project
     */
    public Project updateProject(Long id, Project updatedProject) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Update fields
        if (updatedProject.getTitle() != null && !updatedProject.getTitle().equals(project.getTitle())) {
            project.setTitle(updatedProject.getTitle());
            // Regenerate slug if title changed
            String newSlug = generateSlug(updatedProject.getTitle());
            if (!newSlug.equals(project.getSlug()) && !projectRepository.existsBySlug(newSlug)) {
                project.setSlug(newSlug);
            }
        }

        if (updatedProject.getDescription() != null) {
            project.setDescription(updatedProject.getDescription());
        }

        if (updatedProject.getTechnologies() != null) {
            project.setTechnologies(updatedProject.getTechnologies());
        }

        if (updatedProject.getGithubUrl() != null) {
            project.setGithubUrl(updatedProject.getGithubUrl());
        }

        if (updatedProject.getLiveUrl() != null) {
            project.setLiveUrl(updatedProject.getLiveUrl());
        }

        if (updatedProject.getDemoVideoUrl() != null) {
            project.setDemoVideoUrl(updatedProject.getDemoVideoUrl());
        }

        if (updatedProject.getThumbnailUrl() != null) {
            project.setThumbnailUrl(updatedProject.getThumbnailUrl());
        }

        if (updatedProject.getDisplayOrder() != null) {
            project.setDisplayOrder(updatedProject.getDisplayOrder());
        }

        if (updatedProject.getFeatured() != null) {
            project.setFeatured(updatedProject.getFeatured());
        }

        return projectRepository.save(project);
    }

    /**
     * Delete project
     */
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new IllegalArgumentException("Project not found");
        }
        projectRepository.deleteById(id);
    }

    /**
     * Toggle featured status
     */
    public Project toggleFeatured(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        project.setFeatured(!project.getFeatured());
        return projectRepository.save(project);
    }

    /**
     * Reorder projects
     */
    public void updateDisplayOrder(Long id, int newOrder) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        project.setDisplayOrder(newOrder);
        projectRepository.save(project);
    }

    /**
     * Generate URL-friendly slug from title
     */
    private String generateSlug(String text) {
        return text.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}