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


    @PostMapping("/signup")
    @Operation(
            summary = "Register a new user",
            description = "Creates a new WorkConnect user account"
    )
    public ResponseEntity<ApiResponse> userSignup(
            @Valid @RequestBody RegisterRequestDTO request) {


        ApiResponse response =
                authenticationService.registerUser(request);


        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }



    @PostMapping("/signin")
    @Operation(
            summary = "User login",
            description = "Authenticates user and returns JWT token"
    )
    public ResponseEntity<LoginResponseDTO> userSignin(
            @Valid @RequestBody LoginRequestDTO request) {


        LoginResponseDTO response =
                authenticationService.authenticateUser(request);


        return ResponseEntity
                .ok(response);
    }

}