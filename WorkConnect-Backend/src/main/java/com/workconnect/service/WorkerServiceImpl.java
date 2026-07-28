package com.workconnect.service;

import java.math.BigDecimal;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workconnect.custom_exceptions.DuplicateResourceException;
import com.workconnect.custom_exceptions.ResourceNotFoundException;
import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.JobResponseDTO;
import com.workconnect.dtos.WorkerRequestDTO;
import com.workconnect.entities.JobCategory;
import com.workconnect.entities.JobPost;
import com.workconnect.entities.User;
import com.workconnect.entities.WorkerProfile;
import com.workconnect.repository.JobPostRepository;
import com.workconnect.repository.UserRepository;
import com.workconnect.repository.WorkerRepository;
import com.workconnect.specification.JobPostSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import lombok.RequiredArgsConstructor;

@Service 
@Transactional
@RequiredArgsConstructor
public class WorkerServiceImpl implements WorkerService {

	private final WorkerRepository workerRepository;
	private final UserRepository userRepository;
	private final JobPostRepository jobPostRepository;
	private final ModelMapper mapper;
	
	@Override
	public ApiResponse completeWorkerProfile(WorkerRequestDTO workerDetail) {

	    User user = userRepository.findById(workerDetail.getUserId())
	            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

	    if (workerRepository.existsById(workerDetail.getUserId())) {
	        throw new DuplicateResourceException("Worker profile already exists.");
	    }

	    WorkerProfile worker = mapper.map(workerDetail, WorkerProfile.class);

	    worker.setUser(user);

	    worker.setAverageRating(0.0);

	    workerRepository.save(worker);

	    return ApiResponse.success("Worker profile completed successfully.");
	}
	
	@Override
	public ApiResponse updateWorkerProfile(WorkerRequestDTO workerDetail) {

	    WorkerProfile oldWorkerDetail = workerRepository.findById(workerDetail.getUserId())
	            .orElseThrow(() -> new ResourceNotFoundException("Worker Profile not found"));

	    mapper.map(workerDetail, oldWorkerDetail);

	    return ApiResponse.success("Worker Profile updated successfully");
	}
	
	@Override
	public Page<JobResponseDTO> searchJobs(
	        String keyword,
	        String location,
	        JobCategory category,
	        BigDecimal  minBudget,
	        BigDecimal  maxBudget,
	        int page,
	        int size,
	        String sortBy,
	        String direction) {

	    Sort sort = direction.equalsIgnoreCase("ASC")
	            ? Sort.by(sortBy).ascending()
	            : Sort.by(sortBy).descending();

	    Pageable pageable = PageRequest.of(page, size, sort);

	    Specification<JobPost> specification = Specification.allOf();

	    if (keyword != null && !keyword.isBlank()) {
	        specification = specification.and(
	                JobPostSpecification.hasKeyword(keyword));
	    }

	    if (location != null && !location.isBlank()) {
	        specification = specification.and(
	                JobPostSpecification.hasLocation(location));
	    }

	    if (category != null) {
	        specification = specification.and(
	                JobPostSpecification.hasCategory(category));
	    }

	    if (minBudget != null) {
	        specification = specification.and(
	                JobPostSpecification.minBudget(minBudget));
	    }

	    if (maxBudget != null) {
	        specification = specification.and(
	                JobPostSpecification.maxBudget(maxBudget));
	    }

	    Page<JobPost> jobs = jobPostRepository.findAll(specification, pageable);

	    return jobs.map(this::mapToDTO);
	}

	private JobResponseDTO mapToDTO(JobPost job) {

	    JobResponseDTO dto = mapper.map(job, JobResponseDTO.class);

	    dto.setJobPostId(job.getJobId());
	    dto.setEmployerId(job.getEmployerProfile().getEmployerId());
	    dto.setEmployerName(job.getEmployerProfile().getOrganizationName());

	    return dto;
	}
	
	@Override
	public ApiResponse applyJob(WorkerRequestDTO workerDetail) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ApiResponse withdrawApplication(Long applicationId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<JobResponseDTO> viewAppliedJobs(Long workerId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<JobResponseDTO> viewActiveContracts(Long workerId) {
		// TODO Auto-generated method stub
		return null;
	}

}
