package com.workconnect.dtos;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RazorpayOrderResponseDTO {

    private String orderId;

    private BigDecimal amount;

    private String currency;

    private String keyId;

    private Long paymentId;
}