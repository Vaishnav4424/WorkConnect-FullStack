package com.workconnect.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Component
@RequiredArgsConstructor
@Slf4j
public class CustomJWTVerificationFilter extends OncePerRequestFilter {


    private final JwtUtils jwtUtils;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {


        try {

            log.info("****** JWT Filter Executing ******");


            String authHeader = request.getHeader("Authorization");


            if (authHeader != null && authHeader.startsWith("Bearer ")) {


                String jwt = authHeader.substring(7);


                log.info("JWT Token Received");


                // Validate JWT
                Claims claims = jwtUtils.validateToken(jwt);


                // Extract claims
                Long userId = claims.get("userId", Long.class);

                String role = claims.get("role", String.class);


                log.info("User Id : {}", userId);
                log.info("Role : {}", role);


                // Create Authentication Object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userId,
                                null,
                                List.of(
                                    new SimpleGrantedAuthority(
                                        "ROLE_" + role
                                    )
                                )
                        );


                // Store Authentication
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);

            }


            filterChain.doFilter(request, response);


        } catch (Exception e) {


            log.error("JWT Validation Failed : {}", e.getMessage());


            SecurityContextHolder.clearContext();


            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );

            response.getWriter()
                    .write("Invalid or Expired JWT Token");


        }
    }
}