package com.test.portfolio;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.portfolio.StartPortfolio;

@SpringBootTest(classes = StartPortfolio.class) // Ensure correct main class is used
class StartPortfolioTests {

    @Test
    void contextLoads() {
        System.out.println("Done"); // Ensure test execution
    }
}
