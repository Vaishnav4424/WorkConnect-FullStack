package com.workconnect.security;

import java.security.Key;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.workconnect.entities.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key secretKey;

    @PostConstruct
    public void init() {
        secretKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Generate JWT Token
    public String generateToken(CustomUserDetails userDetails) {

        User user = userDetails.getUser();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expiration);

        return Jwts.builder()
                .subject(user.getEmail())
                .issuedAt(now)
                .expiration(expiryDate)
                .claims(Map.of(
                        "userId", user.getUserId(),
                        "role", user.getRole().name(),
                        "firstName", user.getFirstName()
                ))
                .signWith(secretKey)
                .compact();
    }

    // Validate Token and return Claims
    public Claims validateToken(String token) {

        return Jwts.parser()
                .verifyWith((javax.crypto.SecretKey) secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Extract Email
    public String extractUsername(String token) {
        return validateToken(token).getSubject();
    }

    // Check Token Validity
    public boolean isTokenValid(String token) {
        try {
            validateToken(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }
}