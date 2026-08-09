package com.workconnect.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final CustomJWTVerificationFilter customJWTVerificationFilter;


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(request -> request


                        // =================================================
                        // PUBLIC ENDPOINTS
                        // =================================================

                        .requestMatchers(
                                "/users/signup",
                                "/users/signin",

                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/webjars/**"
                        ).permitAll()


                        // =================================================
                        // CORS PREFLIGHT
                        // =================================================

                        .requestMatchers(HttpMethod.OPTIONS,"/**").permitAll()

                        // =================================================
                        // EMPLOYER APIs
                        // =================================================

                        .requestMatchers(HttpMethod.POST, "/employers/profile").hasRole("EMPLOYER")

                        .requestMatchers(HttpMethod.PUT, "/employers/profile").hasRole("EMPLOYER")


                        .requestMatchers(HttpMethod.POST, "/jobs/**").hasRole("EMPLOYER")

                        .requestMatchers(HttpMethod.PUT, "/jobs/**").hasRole("EMPLOYER")

                        .requestMatchers(HttpMethod.DELETE,"/jobs/**").hasRole("EMPLOYER")


                        // =================================================
                        // WORKER APIs
                        // =================================================

                        .requestMatchers(HttpMethod.POST, "/workers/profile").hasRole("WORKER")

                        .requestMatchers(HttpMethod.PUT, "/workers/profile").hasRole("WORKER")

                        .requestMatchers(HttpMethod.POST,"/applications/**").hasRole("WORKER")

                        .requestMatchers(HttpMethod.DELETE,"/applications/**").hasRole("WORKER")


                        .requestMatchers(HttpMethod.GET,"/workers/**").hasRole("WORKER")


                        // =================================================
                        // ADMIN APIs
                        // =================================================

                        .requestMatchers("/admin/**").hasRole("ADMIN")


                        // =================================================
                        // ALL OTHER APIs
                        // =================================================

                        .anyRequest().authenticated()
                );

        http.addFilterBefore(customJWTVerificationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // React frontend URL
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Allowed HTTP methods
        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        // Allowed headers
        configuration.setAllowedHeaders(List.of("*"));

        // Allow credentials
        configuration.setAllowCredentials(true);

        // Register CORS configuration
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}

