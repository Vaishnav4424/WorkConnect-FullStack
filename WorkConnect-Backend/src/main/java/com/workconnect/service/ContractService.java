package com.workconnect.service;

import java.util.List;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.ContractRequestDTO;
import com.workconnect.dtos.ContractResponseDTO;
import com.workconnect.entities.ContractStatus;

public interface ContractService {

	ApiResponse createContract(ContractRequestDTO requestDTO);

	ContractResponseDTO getContractById(Long contractId);

	List<ContractResponseDTO> getEmployerContracts(Long employerId);

	List<ContractResponseDTO> getWorkerContracts(Long workerId);

	ApiResponse updateContractStatus(Long contractId, ContractStatus status);

	ApiResponse deleteContract(Long contractId);
	
}
