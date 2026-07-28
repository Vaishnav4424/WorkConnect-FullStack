package com.workconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workconnect.entities.WorkerProfile;

public interface WorkerRepository extends JpaRepository <WorkerProfile , Long>{

	boolean existsByUserUserId(Long userId);
	
}
