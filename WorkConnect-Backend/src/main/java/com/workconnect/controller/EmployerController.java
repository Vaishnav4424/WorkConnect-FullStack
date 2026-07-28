package com.workconnect.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.EmployerRequestDTO;
import com.workconnect.dtos.JobRequestDTO;
import com.workconnect.dtos.JobResponseDTO;
import com.workconnect.service.EmployerService;
import com.workconnect.service.JobPostService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/employers")
@RequiredArgsConstructor
public class EmployerController {

    private final EmployerService employerService;
    private final JobPostService jobPostService;

    @PostMapping("/complete-profile")
    @Operation(summary = "Complete Employer Profile")
    public ResponseEntity<ApiResponse> completeEmployerProfile(@Valid @RequestBody EmployerRequestDTO request) {

        ApiResponse response = employerService.completeEmployerProfile(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/update-profile")
    @Operation(summary = "Update Employer Profile")
    public ResponseEntity<ApiResponse> updateEmployerProfile(@Valid @RequestBody EmployerRequestDTO request) {

        ApiResponse response = employerService.updateEmployerProfile(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{employerId}/jobs")
    @Operation(summary = "Create a new job post")
    public ResponseEntity<ApiResponse> createJob(@PathVariable Long employerId, @Valid @RequestBody JobRequestDTO jobRequestDTO) {

        ApiResponse response = jobPostService.createJob(jobRequestDTO, employerId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{employerId}/jobs")
    @Operation(summary = "Get all jobs posted by an employer")
    public ResponseEntity<List<JobResponseDTO>> getJobsByEmployerId(@PathVariable Long employerId) {

        List<JobResponseDTO> jobs = jobPostService.getJobsByEmployerId(employerId);
        return ResponseEntity.ok(jobs);
    }
}