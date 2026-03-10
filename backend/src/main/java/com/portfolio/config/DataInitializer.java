package com.portfolio.config;

import com.portfolio.model.User;
import com.portfolio.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.owner.username}")
    private String ownerUsername;

    @Value("${app.owner.password}")
    private String ownerPassword;

    @PostConstruct
    public void init() {
        if (userRepository.findByUsername(ownerUsername).isEmpty()) {
            User owner = new User();
            owner.setUsername(ownerUsername);
            owner.setPassword(passwordEncoder.encode(ownerPassword));
            owner.setEmail("owner@portfolio.com");
            owner.setFullName("Portfolio Owner");
            userRepository.save(owner);
        }
    }
}