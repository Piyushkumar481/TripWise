package com.tripwise.backend;

import com.tripwise.backend.support.PostgresIntegrationTestBase;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BackendApplicationTests extends PostgresIntegrationTestBase {

    @Test
    void contextLoads() {
    }

}
