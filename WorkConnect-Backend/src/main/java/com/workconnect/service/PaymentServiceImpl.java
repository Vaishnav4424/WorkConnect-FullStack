package com.workconnect.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.workconnect.custom_exceptions.PaymentProcessingException;
import com.workconnect.custom_exceptions.ResourceNotFoundException;
import com.workconnect.dtos.PaymentRequestDTO;
import com.workconnect.dtos.PaymentResponseDTO;
import com.workconnect.dtos.PaymentVerificationRequestDTO;
import com.workconnect.dtos.RazorpayOrderResponseDTO;
import com.workconnect.entities.Contract;
import com.workconnect.entities.Payment;
import com.workconnect.entities.PaymentMethod;
import com.workconnect.entities.PaymentStatus;
import com.workconnect.repository.ContractRepository;
import com.workconnect.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final ContractRepository contractRepository;
    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Override
    public PaymentResponseDTO createPayment(PaymentRequestDTO request) {

        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: "+ request.getContractId()));

        if (request.getPaymentMethod() == PaymentMethod.RAZORPAY) {
            throw new PaymentProcessingException("Use the Razorpay create-order endpoint " + "for Razorpay payments.");
        }

        Payment payment = new Payment();

        payment.setContract(contract);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus(PaymentStatus.PENDING);

        Payment savedPayment = paymentRepository.save(payment);

        return convertToResponseDTO(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentById(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));

        return convertToResponseDTO(payment);
    }


    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getPaymentsByContract(Long contractId) {

        contractRepository.findById(contractId)
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + contractId));

        return paymentRepository
                .findByContractContractId(contractId)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }


    // ============================================================
    // GET PAYMENTS BY STATUS
    // ============================================================

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatus paymentStatus) {

        return paymentRepository
                .findByPaymentStatus(paymentStatus)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }


    // ============================================================
    // UPDATE PAYMENT STATUS
    // ============================================================

    @Override
    public PaymentResponseDTO updatePaymentStatus(Long paymentId,PaymentStatus paymentStatus) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));

        payment.setPaymentStatus(paymentStatus);

        Payment updatedPayment = paymentRepository.save(payment);

        return convertToResponseDTO(updatedPayment);
    }


    // ============================================================
    // CREATE RAZORPAY ORDER
    // ============================================================

    @Override
    public RazorpayOrderResponseDTO createRazorpayOrder(PaymentRequestDTO request) {

        validateRazorpayConfiguration();

        if (request.getPaymentMethod()!= PaymentMethod.RAZORPAY) {

            throw new PaymentProcessingException("Payment method must be RAZORPAY " + "for Razorpay order creation.");
        }

        if (request.getAmount() == null || request.getAmount().compareTo(new BigDecimal("0.10")) < 0) {

            throw new PaymentProcessingException("Razorpay payment amount must be " + "at least ₹0.10.");
        }

        Contract contract = contractRepository.findById(request.getContractId())
                .orElseThrow(() -> new ResourceNotFoundException("Contract not found with ID: " + request.getContractId()));

        try {

            /*
             * Razorpay expects the amount in paise.
             *
             * Example:
             * ₹500 becomes 50000 paise.
             */
            long amountInPaise = request.getAmount().multiply(BigDecimal.valueOf(100)).longValueExact();

            /*
             * Razorpay receipt should be unique.
             *
             * Example:
             * wc_1_a12b34cd
             */
            String receipt = "wc_" + contract.getContractId() + "_" + UUID.randomUUID().toString().substring(0, 8);

            JSONObject orderRequest = new JSONObject();

            orderRequest.put("amount", amountInPaise);

            orderRequest.put("currency","INR");

            orderRequest.put("receipt",receipt);

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);

            String razorpayOrderId = razorpayOrder.get("id");

            /*
             * Save a PENDING payment only after
             * Razorpay successfully creates the order.
             */
            Payment payment = new Payment();

            payment.setContract(contract);
            payment.setAmount(request.getAmount());
            payment.setPaymentMethod(PaymentMethod.RAZORPAY);
            payment.setPaymentStatus(PaymentStatus.PENDING);

            Payment savedPayment = paymentRepository.save(payment);

            return new RazorpayOrderResponseDTO(
                    razorpayOrderId,
                    request.getAmount(),
                    "INR",
                    razorpayKeyId,
                    savedPayment.getPaymentId()
            );

        } catch (ArithmeticException e) {

            log.error("Invalid Razorpay payment amount: {}", request.getAmount(), e);

            throw new PaymentProcessingException("Payment amount can contain " + "a maximum of two decimal places.", e);

        } catch (Exception e) {

            log.error("Razorpay order creation failed: {}", e.getMessage(), e);

            throw new PaymentProcessingException(
                    "Unable to create Razorpay order. "
                            + "Check your Razorpay Test API keys, "
                            + "payment amount, and internet connection.",
                    e
            );
        }
    }


    // ============================================================
    // VERIFY RAZORPAY PAYMENT
    // ============================================================

    @Override
    @Transactional(noRollbackFor = PaymentProcessingException.class)
    public PaymentResponseDTO verifyPayment(PaymentVerificationRequestDTO request) {

        validateRazorpayConfiguration();

        if (request.getPaymentId() == null) {
            throw new PaymentProcessingException("Payment ID is required " + "for payment verification.");
        }

        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + request.getPaymentId()));

        if (payment.getPaymentMethod()!= PaymentMethod.RAZORPAY) {

            throw new PaymentProcessingException("Only Razorpay payments can be " + "verified using this endpoint.");
        }

        try {

            JSONObject attributes = new JSONObject();

            attributes.put("razorpay_order_id",request.getRazorpayOrderId());

            attributes.put("razorpay_payment_id",request.getRazorpayPaymentId());

            attributes.put("razorpay_signature", request.getRazorpaySignature());

            boolean signatureValid = Utils.verifyPaymentSignature(attributes, razorpayKeySecret);

            if (!signatureValid) {

                payment.setPaymentStatus(PaymentStatus.FAILED);

                paymentRepository.save(payment);

                throw new PaymentProcessingException("Razorpay payment signature " + "verification failed.");
            }

            payment.setPaymentStatus(PaymentStatus.SUCCESS);

            Payment updatedPayment = paymentRepository.save(payment);

            return convertToResponseDTO(updatedPayment);

        } catch (PaymentProcessingException e) {

            throw e;

        } catch (Exception e) {

            payment.setPaymentStatus(PaymentStatus.FAILED);

            paymentRepository.save(payment);

            log.error("Razorpay verification failed: {}", e.getMessage(), e);

            throw new PaymentProcessingException("Unable to verify Razorpay payment.", e);
        }
    }


    // ============================================================
    // CONVERT ENTITY TO RESPONSE DTO
    // ============================================================

    private PaymentResponseDTO convertToResponseDTO(Payment payment) {

        PaymentResponseDTO response = new PaymentResponseDTO();

        response.setPaymentId(payment.getPaymentId());

        response.setAmount(payment.getAmount());

        response.setPaymentMethod(payment.getPaymentMethod());

        response.setPaymentDate(payment.getPaymentDate());

        response.setPaymentStatus(payment.getPaymentStatus());

        if (payment.getContract() != null) {
            response.setContractId(payment.getContract().getContractId());
        }

        return response;
    }


    // ============================================================
    // VALIDATE RAZORPAY CONFIGURATION
    // ============================================================

    private void validateRazorpayConfiguration() {

        if (looksLikePlaceholder(razorpayKeyId)
                || looksLikePlaceholder(
                        razorpayKeySecret
                )) {

            throw new PaymentProcessingException(
                    "Razorpay Test API keys are not configured. "
                            + "Update razorpay.key.id and "
                            + "razorpay.key.secret."
            );
        }
    }


    private boolean looksLikePlaceholder(String value) {

        if (value == null || value.isBlank()) {
            return true;
        }

        String normalizedValue = value.trim().toLowerCase();

        return normalizedValue.contains("placeholder")
                || normalizedValue.contains(
                        "your_key"
                )
                || normalizedValue.contains(
                        "your_secret"
                )
                || normalizedValue.contains(
                        "xxx"
                );
    }
}