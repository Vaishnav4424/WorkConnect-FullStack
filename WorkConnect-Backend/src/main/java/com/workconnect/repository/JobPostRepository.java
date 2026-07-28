package com.workconnect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.workconnect.entities.JobPost;
import com.workconnect.entities.JobStatus;

public interface JobPostRepository extends JpaRepository<JobPost, Long>, JpaSpecificationExecutor<JobPost> {

    List<JobPost> findByEmployerProfileEmployerIdAndStatusNot(Long employerId, JobStatus status);

}