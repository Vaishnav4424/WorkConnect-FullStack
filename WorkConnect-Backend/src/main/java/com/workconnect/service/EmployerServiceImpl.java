package com.workconnect.service;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workconnect.custom_exceptions.DuplicateResourceException;
import com.workconnect.custom_exceptions.ResourceNotFoundException;
import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.EmployerRequestDTO;
import com.workconnect.entities.EmployerProfile;
import com.workconnect.entities.User;
import com.workconnect.repository.EmployerRepository;
import com.workconnect.repository.UserRepository;


import lombok.RequiredArgsConstructor;

@Service 
@Transactional
@RequiredArgsConstructor
public class EmployerServiceImpl implements EmployerService {

	private final UserRepository userRepository;
	private final EmployerRepository employerRepository;
	private final ModelMapper mapper;
	
	@Override
	public ApiResponse completeEmployerProfile(EmployerRequestDTO employerDetail) {

	    User user = userRepository.findById(employerDetail.getUserId())
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("User not found"));

	    if (employerRepository.existsById(employerDetail.getUserId())) {
	        throw new DuplicateResourceException("Employer profile already exists.");
	    }

	    EmployerProfile employer = mapper.map(employerDetail, EmployerProfile.class);

	    employer.setUser(user);

	    employerRepository.save(employer);

	    return ApiResponse.success("Employer profile completed successfully.");
	}
	
	@Override
	public ApiResponse updateEmployerProfile(EmployerRequestDTO employerDetail) {

	    EmployerProfile oldEmployerDetail = employerRepository.findById(employerDetail.getUserId())
	            .orElseThrow(() -> new ResourceNotFoundException("Employer Profile not found"));

	    mapper.map(employerDetail, oldEmployerDetail);

	    return ApiResponse.success("Employer Profile updated successfully");
	}

}
