package com.workconnect.service;

import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workconnect.custom_exceptions.ResourceNotFoundException;
import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.JobRequestDTO;
import com.workconnect.dtos.JobResponseDTO;
import com.workconnect.entities.EmployerProfile;
import com.workconnect.entities.JobPost;
import com.workconnect.entities.JobStatus;
import com.workconnect.repository.EmployerRepository;
import com.workconnect.repository.JobPostRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class JobPostServiceImpl implements JobPostService {

    private final JobPostRepository jobPostRepository;
    private final EmployerRepository employerProfileRepository;
    private final ModelMapper modelMapper;

    @Override
    public ApiResponse createJob(JobRequestDTO createJobDTO, Long employerId) {

        EmployerProfile employerProfile = employerProfileRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found."));

        JobPost jobPost = modelMapper.map(createJobDTO, JobPost.class);

        jobPost.setEmployerProfile(employerProfile);
        jobPost.setPostedDate(LocalDate.now());
        jobPost.setStatus(JobStatus.OPEN);

        jobPostRepository.save(jobPost);

        return ApiResponse.created("Job posted successfully.");
    }

    @Override
    public ApiResponse updateJob(JobRequestDTO updateJobDTO, Long jobPostId) {

        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found."));

        modelMapper.map(updateJobDTO, jobPost);

        return ApiResponse.success("Job updated successfully.");
    }

    @Override
    public ApiResponse deleteJob(Long jobPostId) {

        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found."));

        jobPost.setStatus(JobStatus.CANCELLED);

        return ApiResponse.success("Job deleted successfully.");
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponseDTO> getJobsByEmployerId(Long employerId) {

        List<JobPost> jobs = jobPostRepository.findByEmployerProfileEmployerIdAndStatusNot(employerId, JobStatus.CANCELLED);

        return jobs.stream().map(this::convertToDTO).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponseDTO getJobById(Long jobPostId) {

        JobPost jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found."));

        return convertToDTO(jobPost);
    }

    private JobResponseDTO convertToDTO(JobPost jobPost) {

        JobResponseDTO dto = modelMapper.map(jobPost, JobResponseDTO.class);

        dto.setEmployerId(jobPost.getEmployerProfile().getEmployerId());

        dto.setEmployerName(
                jobPost.getEmployerProfile()
                       .getUser()
                       .getFirstName()
                + " "
                + jobPost.getEmployerProfile()
                       .getUser()
                       .getLastName());

        return dto;
    }
}
