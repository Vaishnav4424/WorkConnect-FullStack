package com.workconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workconnect.entities.EmployerProfile;

public interface EmployerRepository extends JpaRepository<EmployerProfile, Long> {

}
