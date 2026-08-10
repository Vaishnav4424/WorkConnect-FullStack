package com.workconnect.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workconnect.entities.Payment;
import com.workconnect.entities.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByContractContractId(Long contractId);

    Optional<Payment> findByPaymentIdAndPaymentStatus(Long paymentId, PaymentStatus paymentStatus);

    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);
}