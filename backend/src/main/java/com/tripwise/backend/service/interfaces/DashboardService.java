package com.tripwise.backend.service.interfaces;

import com.tripwise.backend.dto.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboard(String email);
}