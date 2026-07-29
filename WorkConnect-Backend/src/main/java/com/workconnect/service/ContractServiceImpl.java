package com.workconnect.service;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workconnect.custom_exceptions.DuplicateResourceException;
import com.workconnect.custom_exceptions.ResourceNotFoundException;
import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.ContractRequestDTO;
import com.workconnect.dtos.ContractResponseDTO;
import com.workconnect.entities.Contract;
import com.workconnect.entities.ContractStatus;
import com.workconnect.entities.JobApplication;
import com.workconnect.repository.ContractRepository;
import com.workconnect.repository.EmployerRepository;
import com.workconnect.repository.JobApplicationRepository;
import com.workconnect.repository.WorkerRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ContractServiceImpl implements ContractService {


    private final ContractRepository contractRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final EmployerRepository employerRepository;
    private final WorkerRepository workerRepository;
    private final ModelMapper mapper;


    @Override
    public ApiResponse createContract(ContractRequestDTO requestDTO) {


        if (contractRepository.existsByJobApplicationApplicationId(requestDTO.getApplicationId())) {

            throw new DuplicateResourceException("Contract already exists for this application");
        }

        JobApplication application = jobApplicationRepository.findById(requestDTO.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + requestDTO.getApplicationId()));

        Contract contract = mapper.map(requestDTO, Contract.class);

        contract.setJobApplication(application);

        contract.setContractStatus(ContractStatus.ACTIVE);

        contractRepository.save(contract);

        return ApiResponse.created("Contract created successfully");
    }


    @Override
    public ContractResponseDTO getContractById(Long contractId) {


        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + contractId));

        return convertToDto(contract);
    }


    @Override
    public List<ContractResponseDTO> getEmployerContracts(Long employerId) {


        employerRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found with id: " + employerId));


        List<Contract> contracts = contractRepository.findByJobApplicationJobPostEmployerProfileEmployerId(employerId);


        return contracts.stream().map(this::convertToDto).toList();
    }


    @Override
    public List<ContractResponseDTO> getWorkerContracts(Long workerId) {


        workerRepository.findById(workerId).orElseThrow(() -> new ResourceNotFoundException("Worker not found with id: " + workerId));

        List<Contract> contracts = contractRepository.findByJobApplicationWorkerProfileWorkerId(workerId);

        return contracts.stream().map(this::convertToDto).toList();
    }


    @Override
    public ApiResponse updateContractStatus(Long contractId,ContractStatus status) {

        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with id: " + contractId));


        if(contract.getContractStatus() == status) {

            return ApiResponse.success("Contract is already in " + status + " status");
        }

        validateStatusChange(contract.getContractStatus(), status);

        contract.setContractStatus(status);

        contractRepository.save(contract);

        return ApiResponse.success("Contract status updated successfully to " + status);
    }


    @Override
    public ApiResponse deleteContract(Long contractId) {


        Contract contract = contractRepository.findById(contractId)
        		.orElseThrow(() ->new ResourceNotFoundException("Contract not found with id: " + contractId));


        if(contract.getContractStatus() != ContractStatus.CANCELLED) {

            throw new IllegalStateException("Only cancelled contracts can be deleted");
        }

        contractRepository.delete(contract);

        return ApiResponse.success("Contract deleted successfully");
    }


    private ContractResponseDTO convertToDto(Contract contract) {


        ContractResponseDTO dto = mapper.map(contract, ContractResponseDTO.class);

        dto.setApplicationId(contract.getJobApplication().getApplicationId());

        dto.setJobId(contract.getJobApplication().getJobPost().getJobId());

        dto.setJobTitle(contract.getJobApplication().getJobPost().getJobTitle());

        dto.setEmployerId(contract.getJobApplication().getJobPost().getEmployerProfile().getEmployerId());

        dto.setEmployerName(contract.getJobApplication().getJobPost().getEmployerProfile().getOrganizationName());

        dto.setWorkerId(contract.getJobApplication().getWorkerProfile().getWorkerId());

        dto.setWorkerName(contract.getJobApplication().getWorkerProfile().getUser().getFirstName()
                + " " +
                contract.getJobApplication().getWorkerProfile().getUser().getLastName());

        dto.setPaymentIds(contract.getPayments().stream().map(payment -> payment.getPaymentId()).toList());

        if(contract.getReview() != null) {

            dto.setReviewId(contract.getReview().getReviewId());
        }

        return dto;
    }


    private void validateStatusChange(ContractStatus currentStatus, ContractStatus newStatus) {

        if(currentStatus == ContractStatus.COMPLETED) {
            throw new IllegalStateException("Completed contract status cannot be changed");
        }

        if(currentStatus == ContractStatus.CANCELLED) {
            throw new IllegalStateException("Cancelled contract status cannot be changed");
        }

        if(currentStatus == ContractStatus.ACTIVE && !(newStatus == ContractStatus.IN_PROGRESS || newStatus == ContractStatus.CANCELLED)) {
            throw new IllegalStateException("Active contract can only move to IN_PROGRESS or CANCELLED");
        }

        if(currentStatus == ContractStatus.IN_PROGRESS && newStatus != ContractStatus.COMPLETED) {
            throw new IllegalStateException("In progress contract can only move to COMPLETED");
        }

    }

}
