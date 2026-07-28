package com.workconnect.service;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.EmployerRequestDTO;

public interface EmployerService {
	
	ApiResponse completeEmployerProfile(EmployerRequestDTO employerDetail);

	ApiResponse updateEmployerProfile(EmployerRequestDTO employerDetail);
	
}
