package com.workconnect.controller;


import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.JobResponseDTO;
import com.workconnect.dtos.WorkerRequestDTO;
import com.workconnect.entities.JobCategory;
import com.workconnect.service.WorkerService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/workers")
@RequiredArgsConstructor
public class WorkerController {

    private final WorkerService workerService;

    @PostMapping("/complete-profile")
    @Operation(summary = "Complete worker profile")
    public ResponseEntity<ApiResponse> completeWorkerProfile(@Valid @RequestBody WorkerRequestDTO request) {

        ApiResponse response = workerService.completeWorkerProfile(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PutMapping("/update-profile")
    @Operation(summary = "Update worker profile")
    public ResponseEntity<ApiResponse> updateWorkerProfile(@Valid @RequestBody WorkerRequestDTO request) {

        ApiResponse response = workerService.updateWorkerProfile(request);

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/jobs/search")
    @Operation(summary = "Search and filter jobs")
    public ResponseEntity<Page<JobResponseDTO>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) JobCategory category,
            @RequestParam(required = false) BigDecimal minBudget,
            @RequestParam(required = false) BigDecimal maxBudget,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "postedDate") String sortBy,
            @RequestParam(defaultValue = "DESC") String direction) {

        Page<JobResponseDTO> jobs = workerService.searchJobs(
                keyword,
                location,
                category,
                minBudget,
                maxBudget,
                page,
                size,
                sortBy,
                direction);

        return ResponseEntity.ok(jobs);
    }
    
}