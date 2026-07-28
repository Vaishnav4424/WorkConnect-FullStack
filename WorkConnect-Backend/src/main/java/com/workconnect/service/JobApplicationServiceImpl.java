package com.workconnect.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workconnect.custom_exceptions.BadRequestException;
import com.workconnect.custom_exceptions.ResourceNotFoundException;
import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.ApplicantResponseDTO;
import com.workconnect.dtos.AppliedJobResponseDTO;
import com.workconnect.dtos.JobApplicationRequestDTO;
import com.workconnect.entities.ApplicationStatus;
import com.workconnect.entities.JobApplication;
import com.workconnect.entities.JobPost;
import com.workconnect.entities.WorkerProfile;
import com.workconnect.repository.JobApplicationRepository;
import com.workconnect.repository.JobPostRepository;
import com.workconnect.repository.WorkerRepository;

import lombok.RequiredArgsConstructor;

@Service 
@Transactional
@RequiredArgsConstructor
public class JobApplicationServiceImpl implements JobApplicationService {

	private final JobApplicationRepository jobApplicationRepository;
	private final JobPostRepository jobPostRepository;
	private final WorkerRepository workerRepository;
	
	@Override
	public ApiResponse applyJob(Long workerId, Long jobId, JobApplicationRequestDTO request) {

	    JobPost jobPost = jobPostRepository.findById(jobId)
	    		.orElseThrow(() -> new ResourceNotFoundException("Job post not found"));

	    WorkerProfile workerProfile = workerRepository.findById(workerId)
	    		.orElseThrow(() -> new ResourceNotFoundException("Worker not found"));

	    if (jobApplicationRepository.existsByWorkerProfileWorkerIdAndJobPostJobId(workerId, jobId)) {
	        throw new BadRequestException("You have already applied for this job.");
	    }

	    JobApplication application = new JobApplication();

	    application.setProposal(request.getProposal());
	    application.setJobPost(jobPost);
	    application.setWorkerProfile(workerProfile);
	   
	    jobApplicationRepository.save(application);

	    return ApiResponse.created("Job application submitted successfully.");
	}

	@Override
	public ApiResponse withdrawApplication(Long applicationId) {

	    JobApplication application = jobApplicationRepository.findById(applicationId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "Job application not found with id: " + applicationId
	                    ));

	    if (application.getApplicationStatus() == ApplicationStatus.ACCEPTED) {
	        throw new BadRequestException(
	                "Accepted applications cannot be withdrawn."
	        );
	    }

	    application.setApplicationStatus(ApplicationStatus.WITHDRAWN);

	    jobApplicationRepository.save(application);

	    return ApiResponse.success(
	            "Job application withdrawn successfully."
	    );
	}

	@Override
	public List<AppliedJobResponseDTO> getWorkerApplications(Long workerId) {

	    if (!workerRepository.existsById(workerId)) {
	        throw new ResourceNotFoundException("Worker not found with id: " + workerId);
	    }

	    List<JobApplication> applications =
	            jobApplicationRepository.findByWorkerProfileWorkerId(workerId);

	    return applications.stream()
	            .map(this::mapToAppliedJobResponseDTO)
	            .toList();
	}

	@Override
	public List<ApplicantResponseDTO> getJobApplicants(Long jobId) {

	    if (!jobPostRepository.existsById(jobId)) {
	        throw new ResourceNotFoundException(
	                "Job post not found with id: " + jobId
	        );
	    }

	    List<JobApplication> applications =
	            jobApplicationRepository.findByJobPostJobId(jobId);

	    return applications.stream()
	            .map(this::mapToApplicantResponseDTO)
	            .toList();
	}

	@Override
	public ApiResponse updateApplicationStatus(Long applicationId, ApplicationStatus status) {

	    JobApplication application = jobApplicationRepository.findById(applicationId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("Job application not found with id: " + applicationId));

	    // Optional validation
	    if (application.getApplicationStatus() == ApplicationStatus.WITHDRAWN) {
	        throw new BadRequestException("Withdrawn applications cannot be updated.");
	    }

	    application.setApplicationStatus(status);

	    jobApplicationRepository.save(application);

	    return ApiResponse.success("Application status updated successfully to " + status);
	}

	private AppliedJobResponseDTO mapToAppliedJobResponseDTO(JobApplication application) {

	    AppliedJobResponseDTO dto = new AppliedJobResponseDTO();

	    dto.setApplicationId(application.getApplicationId());

	    // Job Details
	    dto.setJobId(application.getJobPost().getJobId());
	    dto.setJobTitle(application.getJobPost().getJobTitle());
	    dto.setCategory(application.getJobPost().getCategory());
	    dto.setLocation(application.getJobPost().getLocation());
	    dto.setBudget(application.getJobPost().getBudget());
	    dto.setDeadline(application.getJobPost().getDeadline());
	    dto.setJobStatus(application.getJobPost().getStatus());

	    // Employer Details (if available)
	    dto.setCompanyName(
	            application.getJobPost()
	                       .getEmployerProfile()
	                       .getOrganizationName());

	    // Application Details
	    dto.setAppliedDate(application.getAppliedDate());
	    dto.setApplicationStatus(application.getApplicationStatus());

	    return dto;
	}
	
	private ApplicantResponseDTO mapToApplicantResponseDTO(JobApplication application) {

	    ApplicantResponseDTO dto = new ApplicantResponseDTO();

	    WorkerProfile worker = application.getWorkerProfile();

	    // Application Details
	    dto.setApplicationId(application.getApplicationId());
	    dto.setAppliedDate(application.getAppliedDate());
	    dto.setApplicationStatus(application.getApplicationStatus());

	    // Worker Details
	    dto.setWorkerId(worker.getWorkerId());
	    dto.setWorkerName(
	            worker.getUser().getFirstName() + " " +
	            worker.getUser().getLastName()
	    );
	    dto.setEmail(worker.getUser().getEmail());

	    dto.setExperienceYears(worker.getExperienceYears());
	    dto.setSkillDescription(worker.getSkillDescription());
	    dto.setHourlyRate(worker.getHourlyRate());

	    return dto;
	}
}
