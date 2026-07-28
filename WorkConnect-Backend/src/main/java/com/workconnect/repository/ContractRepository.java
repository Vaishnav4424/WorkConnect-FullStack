package com.workconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workconnect.entities.Contract;

public interface ContractRepository extends JpaRepository<Contract, Long> {

    List<Contract> findByJobApplicationWorkerProfileWorkerId(Long workerId);

}
