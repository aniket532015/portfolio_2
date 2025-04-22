package com.portfolio;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Allow specific origins
        config.addAllowedOrigin("http://aniket.uk");
        config.addAllowedOrigin("https://aniket.uk"); 
        config.addAllowedOrigin("http://www.aniket.uk");
        config.addAllowedOrigin("https://www.aniket.uk");
        
        // ✅ Allow localhost during development
        config.addAllowedOrigin("http://127.0.0.1:5500");

        // ✅ Allow all methods
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");

        // ✅ Allow all headers
        config.addAllowedHeader("*");

        // ✅ Allow credentials for cookies
        config.setAllowCredentials(true);

        // Apply CORS settings to all paths
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
