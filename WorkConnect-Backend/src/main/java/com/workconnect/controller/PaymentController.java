package com.workconnect.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workconnect.dtos.PaymentRequestDTO;
import com.workconnect.dtos.PaymentResponseDTO;
import com.workconnect.dtos.PaymentVerificationRequestDTO;
import com.workconnect.dtos.RazorpayOrderResponseDTO;
import com.workconnect.entities.PaymentStatus;
import com.workconnect.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ============================================================
    // CREATE PAYMENT
    // ============================================================

    @PostMapping
    public ResponseEntity<PaymentResponseDTO> createPayment(
            @Valid @RequestBody PaymentRequestDTO request) {

        PaymentResponseDTO response =
                paymentService.createPayment(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    // ============================================================
    // GET PAYMENT BY ID
    // ============================================================

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponseDTO> getPaymentById(
            @PathVariable Long paymentId) {

        PaymentResponseDTO response =
                paymentService.getPaymentById(paymentId);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET PAYMENTS BY CONTRACT
    // ============================================================

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByContract(
            @PathVariable Long contractId) {

        List<PaymentResponseDTO> response =
                paymentService.getPaymentsByContract(contractId);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // GET PAYMENTS BY STATUS
    // ============================================================

    @GetMapping("/status/{paymentStatus}")
    public ResponseEntity<List<PaymentResponseDTO>> getPaymentsByStatus(
            @PathVariable PaymentStatus paymentStatus) {

        List<PaymentResponseDTO> response =
                paymentService.getPaymentsByStatus(paymentStatus);

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // UPDATE PAYMENT STATUS
    // ============================================================

    @PutMapping("/{paymentId}/status")
    public ResponseEntity<PaymentResponseDTO> updatePaymentStatus(
            @PathVariable Long paymentId,
            @RequestParam PaymentStatus paymentStatus) {

        PaymentResponseDTO response =
                paymentService.updatePaymentStatus(
                        paymentId,
                        paymentStatus
                );

        return ResponseEntity.ok(response);
    }

    // ============================================================
    // CREATE RAZORPAY ORDER
    // ============================================================

    @PostMapping("/create-order")
    public ResponseEntity<RazorpayOrderResponseDTO> createRazorpayOrder(
            @Valid @RequestBody PaymentRequestDTO request) {

        RazorpayOrderResponseDTO response =
                paymentService.createRazorpayOrder(request);

        return new ResponseEntity<>(
                response,
                HttpStatus.CREATED
        );
    }

    // ============================================================
    // VERIFY RAZORPAY PAYMENT
    // ============================================================

    @PostMapping("/verify")
    public ResponseEntity<PaymentResponseDTO> verifyPayment(
            @Valid @RequestBody PaymentVerificationRequestDTO request) {

        PaymentResponseDTO response =
                paymentService.verifyPayment(request);

        return ResponseEntity.ok(response);
    }
}