package com.workconnect.security;

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

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final CustomJWTVerificationFilter customJWTVerificationFilter;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF
                .csrf(csrf -> csrf.disable())

                // Stateless Session
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Authorization Rules
                .authorizeHttpRequests(request -> request

                        // Public Endpoints
                        .requestMatchers(
                                "/users/signup",
                                "/users/signin",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**",
                                "/webjars/**"
                        ).permitAll()

                        // Allow CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Employer APIs
                        .requestMatchers(HttpMethod.POST, "/employers/profile").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.PUT, "/employers/profile").hasRole("EMPLOYER")

                        .requestMatchers(HttpMethod.POST, "/jobs/**").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.PUT, "/jobs/**").hasRole("EMPLOYER")
                        .requestMatchers(HttpMethod.DELETE, "/jobs/**").hasRole("EMPLOYER")

                        // Worker APIs
                        .requestMatchers(HttpMethod.POST, "/workers/profile").hasRole("WORKER")
                        .requestMatchers(HttpMethod.PUT, "/workers/profile").hasRole("WORKER")

                        .requestMatchers(HttpMethod.POST, "/applications/**").hasRole("WORKER")
                        .requestMatchers(HttpMethod.DELETE, "/applications/**").hasRole("WORKER")

                        .requestMatchers(HttpMethod.GET, "/workers/**").hasRole("WORKER")

                        // Admin APIs
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // All remaining endpoints require authentication
                        .anyRequest().authenticated()
                );

        // JWT Filter
        http.addFilterBefore(customJWTVerificationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}
