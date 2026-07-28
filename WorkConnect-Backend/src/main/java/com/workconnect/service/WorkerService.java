package com.workconnect.service;

import java.math.BigDecimal;
import java.util.List;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.JobResponseDTO;
import com.workconnect.dtos.WorkerRequestDTO;
import com.workconnect.entities.JobCategory;
import org.springframework.data.domain.Page;

public interface WorkerService{

    ApiResponse completeWorkerProfile(WorkerRequestDTO workerDetail);

    ApiResponse updateWorkerProfile(WorkerRequestDTO workerDetail);

    Page<JobResponseDTO> searchJobs(
            String keyword,
            String location,
            JobCategory category,
            BigDecimal minBudget,
            BigDecimal maxBudget,
            int page,
            int size,
            String sortBy,
            String direction);  
    
    ApiResponse applyJob(WorkerRequestDTO workerDetail);

    ApiResponse withdrawApplication(Long applicationId);

    List<JobResponseDTO> viewAppliedJobs(Long workerId);

    List<JobResponseDTO> viewActiveContracts(Long workerId);
}
