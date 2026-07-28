package com.workconnect.service;

import java.util.List;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.JobRequestDTO;
import com.workconnect.dtos.JobResponseDTO;

public interface JobPostService {

    ApiResponse createJob(JobRequestDTO createJobDTO, Long employerId);

    ApiResponse updateJob(JobRequestDTO createJobDTO, Long jobPostId);

    ApiResponse deleteJob(Long jobPostId);

    JobResponseDTO getJobById(Long jobPostId);

	List<JobResponseDTO> getJobsByEmployerId(Long employerId);

}