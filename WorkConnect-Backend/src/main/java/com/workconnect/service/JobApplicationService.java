package com.workconnect.service;

import java.util.List;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.ApplicantResponseDTO;
import com.workconnect.dtos.AppliedJobResponseDTO;
import com.workconnect.dtos.JobApplicationRequestDTO;
import com.workconnect.entities.ApplicationStatus;

public interface JobApplicationService {

	public ApiResponse applyJob(Long workerId, Long jobId, JobApplicationRequestDTO request);

    ApiResponse withdrawApplication(Long applicationId);

    List<AppliedJobResponseDTO> getWorkerApplications(Long workerId);

    List<ApplicantResponseDTO> getJobApplicants(Long jobId);

    ApiResponse updateApplicationStatus(Long applicationId, ApplicationStatus status);
}