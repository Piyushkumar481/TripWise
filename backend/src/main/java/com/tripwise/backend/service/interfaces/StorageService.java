package com.tripwise.backend.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    String store(MultipartFile file);

    void delete(String storedFileName);
}