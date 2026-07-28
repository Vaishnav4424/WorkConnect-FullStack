package com.workconnect.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workconnect.entities.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByWorkerProfileWorkerId(Long workerId);
    
    List<JobApplication> findByJobPostJobId(Long jobId);

    Optional<JobApplication> findByJobPostJobIdAndWorkerProfileWorkerId(Long jobId, Long workerId);
    
    boolean existsByWorkerProfileWorkerIdAndJobPostJobId(Long workerId, Long jobId);

}
