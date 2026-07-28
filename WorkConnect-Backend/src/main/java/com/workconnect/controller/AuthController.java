package com.workconnect.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.LoginRequestDTO;
import com.workconnect.dtos.LoginResponseDTO;
import com.workconnect.dtos.RegisterRequestDTO;
import com.workconnect.service.AuthenticationService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/signUp")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse> userSignUp(@Valid @RequestBody RegisterRequestDTO request) {

        ApiResponse response = authenticationService.registerUser(request);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/signIn")
    @Operation(summary = "Authenticate user")
    public ResponseEntity<LoginResponseDTO> userSignIn(@Valid @RequestBody LoginRequestDTO request) {

        LoginResponseDTO response = authenticationService.authenticateUser(request);
        
        return ResponseEntity.ok(response);
    }
    
}
