package com.tripwise.backend.service.impl;

import com.tripwise.backend.dto.RegisterRequest;
import com.tripwise.backend.dto.UserResponse;
import com.tripwise.backend.entity.User;
import com.tripwise.backend.exception.ResourceAlreadyExistsException;
import com.tripwise.backend.repository.UserRepository;
import com.tripwise.backend.service.interfaces.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse register(RegisterRequest request) {

        log.info("Registering user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {

            log.warn("Registration failed. Email already exists: {}", request.getEmail());

            throw new ResourceAlreadyExistsException("Email already registered.");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .emailVerified(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        log.info("User registered successfully with id: {}", savedUser.getId());

        return UserResponse.builder()
                .id(savedUser.getId())
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .build();
    }
}