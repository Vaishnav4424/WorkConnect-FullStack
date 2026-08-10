package com.workconnect.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.workconnect.entities.PaymentMethod;
import com.workconnect.entities.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponseDTO {

    private Long paymentId;

    private Long contractId;

    private BigDecimal amount;

    private PaymentMethod paymentMethod;

    private LocalDate paymentDate;

    private PaymentStatus paymentStatus;
}