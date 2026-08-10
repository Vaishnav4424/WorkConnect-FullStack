package com.workconnect.service;

import java.util.List;

import com.workconnect.dtos.PaymentRequestDTO;
import com.workconnect.dtos.PaymentResponseDTO;
import com.workconnect.dtos.PaymentVerificationRequestDTO;
import com.workconnect.dtos.RazorpayOrderResponseDTO;
import com.workconnect.entities.PaymentStatus;

public interface PaymentService {

    PaymentResponseDTO createPayment(PaymentRequestDTO request);

    PaymentResponseDTO getPaymentById(Long paymentId);

    List<PaymentResponseDTO> getPaymentsByContract(Long contractId);

    List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatus paymentStatus);

    PaymentResponseDTO updatePaymentStatus(Long paymentId, PaymentStatus paymentStatus);

    RazorpayOrderResponseDTO createRazorpayOrder(PaymentRequestDTO request);

    PaymentResponseDTO verifyPayment(PaymentVerificationRequestDTO request);
}