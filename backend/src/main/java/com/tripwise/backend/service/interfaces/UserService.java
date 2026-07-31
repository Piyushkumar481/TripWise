package com.tripwise.backend.service.interfaces;

import com.tripwise.backend.dto.RegisterRequest;
import com.tripwise.backend.dto.UserResponse;
import com.tripwise.backend.dto.LoginRequest;
import com.tripwise.backend.dto.LoginResponse;
public interface UserService {

    UserResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);

}