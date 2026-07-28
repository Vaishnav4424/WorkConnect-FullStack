package com.workconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workconnect.entities.Payment;

public interface PaymentRepository extends JpaRepository<Payment , Long>{

}
