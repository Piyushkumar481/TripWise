package com.tripwise.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private String token;

    private String tokenType;

    private UserResponse user;
}