package com.tripwise.backend.service.interfaces;

import com.tripwise.backend.dto.RegisterRequest;
import com.tripwise.backend.dto.UserResponse;

public interface UserService {

    UserResponse register(RegisterRequest request);

}