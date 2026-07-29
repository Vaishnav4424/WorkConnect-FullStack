package com.workconnect.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.ApplicantResponseDTO;
import com.workconnect.dtos.AppliedJobResponseDTO;
import com.workconnect.dtos.JobApplicationRequestDTO;
import com.workconnect.entities.ApplicationStatus;
import com.workconnect.service.JobApplicationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final JobApplicationService jobApplicationService;

    @PostMapping
    public ResponseEntity<ApiResponse> applyJob(
            @RequestParam Long workerId,
            @RequestParam Long jobId,
            @RequestBody JobApplicationRequestDTO request) {

        ApiResponse response = jobApplicationService.applyJob(workerId, jobId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @DeleteMapping("/{applicationId}")
    public ResponseEntity<ApiResponse> withdrawApplication(@PathVariable Long applicationId) {

        ApiResponse response = jobApplicationService.withdrawApplication(applicationId);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/worker/{workerId}")
    public ResponseEntity<List<AppliedJobResponseDTO>> getWorkerApplications(@PathVariable Long workerId) {

        List<AppliedJobResponseDTO> appliedJobList = jobApplicationService.getWorkerApplications(workerId);

        return ResponseEntity.ok(appliedJobList);
    }
    
    @GetMapping("/job/{jobId}/applicants")
    public ResponseEntity<List<ApplicantResponseDTO>> getJobApplicants(@PathVariable Long jobId) {

        List<ApplicantResponseDTO> applicantList = jobApplicationService.getJobApplicants(jobId);

        return ResponseEntity.ok(applicantList);
    }
    
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<ApiResponse> updateApplicationStatus(@PathVariable Long applicationId, @RequestParam ApplicationStatus status) {

        ApiResponse response = jobApplicationService.updateApplicationStatus(applicationId, status);

        return ResponseEntity.ok(response);
    }
}
