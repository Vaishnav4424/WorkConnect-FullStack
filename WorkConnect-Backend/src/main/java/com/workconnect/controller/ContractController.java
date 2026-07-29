package com.workconnect.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.ContractRequestDTO;
import com.workconnect.dtos.ContractResponseDTO;
import com.workconnect.entities.ContractStatus;
import com.workconnect.service.ContractService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
@Tag(name = "Contract APIs", description = "APIs for Managing Contracts")
public class ContractController {

    private final ContractService contractService;

    // 1. Create Contract
    @PostMapping
    @Operation(summary = "Create a New Contract")
    public ResponseEntity<ApiResponse> createContract(
            @RequestBody @Valid ContractRequestDTO requestDTO) {

        ApiResponse response = contractService.createContract(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 2. Get Contract By ID
    @GetMapping("/{contractId}")
    @Operation(summary = "Get Contract By ID")
    public ResponseEntity<ContractResponseDTO> getContractById(
            @PathVariable Long contractId) {

        return ResponseEntity.ok(contractService.getContractById(contractId));
    }

    // 3. Get Contracts By Employer
    @GetMapping("/employer/{employerId}")
    @Operation(summary = "Get All Contracts of an Employer")
    public ResponseEntity<List<ContractResponseDTO>> getEmployerContracts(
            @PathVariable Long employerId) {

        return ResponseEntity.ok(contractService.getEmployerContracts(employerId));
    }

    // 4. Get Contracts By Worker
    @GetMapping("/worker/{workerId}")
    @Operation(summary = "Get All Contracts of a Worker")
    public ResponseEntity<List<ContractResponseDTO>> getWorkerContracts(
            @PathVariable Long workerId) {

        return ResponseEntity.ok(contractService.getWorkerContracts(workerId));
    }

    // 5. Update Contract Status
    @PutMapping("/{contractId}/status")
    @Operation(summary = "Update Contract Status")
    public ResponseEntity<ApiResponse> updateContractStatus(
            @PathVariable Long contractId,
            @RequestParam ContractStatus status) {

        ApiResponse response =
                contractService.updateContractStatus(contractId, status);

        return ResponseEntity.ok(response);
    }

    // 6. Delete Contract
    @DeleteMapping("/{contractId}")
    @Operation(summary = "Delete Contract")
    public ResponseEntity<ApiResponse> deleteContract(
            @PathVariable Long contractId) {

        ApiResponse response = contractService.deleteContract(contractId);
        return ResponseEntity.ok(response);
    }
}