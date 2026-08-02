package com.workconnect.service;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workconnect.custom_exceptions.DuplicateResourceException;
import com.workconnect.custom_exceptions.ResourceNotFoundException;
import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.ChangePasswordDTO;
import com.workconnect.dtos.LoginRequestDTO;
import com.workconnect.dtos.LoginResponseDTO;
import com.workconnect.dtos.RegisterRequestDTO;
import com.workconnect.entities.User;
import com.workconnect.repository.UserRepository;
import com.workconnect.security.CustomUserDetails;
import com.workconnect.security.JwtUtils;

import lombok.RequiredArgsConstructor;


@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {


    private final UserRepository userRepo;

    private final ModelMapper mapper;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtils jwtUtils;



    @Override
    public ApiResponse registerUser(RegisterRequestDTO request) {


        if(userRepo.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException(
                    "Email is already registered"
            );
        }


        User user = mapper.map(request, User.class);


        // Encrypt password
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );


        userRepo.save(user);


        return ApiResponse.success(
                "User registered successfully"
        );
    }





    @Override
    public LoginResponseDTO authenticateUser(
            LoginRequestDTO request) {


        // Find user using email
        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Invalid email or password"
                    )
                );



        // Verify password
        if(!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {


            throw new ResourceNotFoundException(
                    "Invalid email or password"
            );
        }



        // Create UserDetails
        CustomUserDetails userDetails =
                new CustomUserDetails(user);



        // Generate JWT
        String token =
                jwtUtils.generateToken(userDetails);



        LoginResponseDTO response =
                new LoginResponseDTO();


        response.setToken(token);

        response.setMessage(
                "Login successful"
        );


        return response;
    }





    @Override
    public ApiResponse changePassword(
            ChangePasswordDTO request) {

        return null;
    }

}