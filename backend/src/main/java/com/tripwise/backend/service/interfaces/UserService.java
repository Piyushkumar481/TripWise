package com.tripwise.backend.service.interfaces;

import com.tripwise.backend.dto.LoginRequest;
import com.tripwise.backend.dto.LoginResponse;
import com.tripwise.backend.dto.RegisterRequest;
import com.tripwise.backend.dto.UpdateProfileRequest;
import com.tripwise.backend.dto.UserResponse;

public interface UserService {

    UserResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    UserResponse getCurrentUser(String email);

    UserResponse updateCurrentUser(
            String email,
            UpdateProfileRequest request);
}