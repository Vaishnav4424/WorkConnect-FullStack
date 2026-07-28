package com.workconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.JobRequestDTO;
import com.workconnect.dtos.JobResponseDTO;
import com.workconnect.service.JobPostService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobPostService jobPostService;

    @PutMapping("/{jobPostId}")
    @Operation(summary = "Update job post")
    public ResponseEntity<ApiResponse> updateJob(@PathVariable Long jobPostId, @Valid @RequestBody JobRequestDTO updateJobDTO) {

        ApiResponse apiResponse = jobPostService.updateJob(updateJobDTO, jobPostId);

        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{jobPostId}")
    @Operation(summary = "Delete job post")
    public ResponseEntity<ApiResponse> deleteJob(@PathVariable Long jobPostId) {

        ApiResponse apiResponse = jobPostService.deleteJob(jobPostId);

        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{jobPostId}")
    @Operation(summary = "Get job by ID")
    public ResponseEntity<JobResponseDTO> getJobById(@PathVariable Long jobPostId) {

        JobResponseDTO jobResponseDTO = jobPostService.getJobById(jobPostId);

        return ResponseEntity.ok(jobResponseDTO);
    }
}