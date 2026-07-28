package com.workconnect.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workconnect.custom_exceptions.DuplicateResourceException;
import com.workconnect.custom_exceptions.ResourceNotFoundException;
import com.workconnect.dtos.*;
import com.workconnect.entities.User;
import com.workconnect.repository.UserRepository;

import lombok.*;

@Service
@Transactional 
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

	private final UserRepository userRepo;
	private final ModelMapper mapper;
	
	@Override
	public ApiResponse registerUser(RegisterRequestDTO request) {
		
		if (userRepo.existsByEmail(request.getEmail())) {
		    throw new DuplicateResourceException("Email is already registered.");
		}
		
		User newUser = mapper.map(request, User.class);
		userRepo.save(newUser);
		
		return ApiResponse.success("User registered successfully");
	}

	@Override
	public LoginResponseDTO authenticateUser(LoginRequestDTO request) {
		
		User user = userRepo.findByEmailAndPassword(request.getEmail(), request.getPassword())
				.orElseThrow(() -> new ResourceNotFoundException("Invalid email or password"));
		
		return mapper.map(user, LoginResponseDTO.class);
	}

	@Override
	public ApiResponse changePassword(ChangePasswordDTO request) {
		// TODO Auto-generated method stub
		return null;
	}

}
