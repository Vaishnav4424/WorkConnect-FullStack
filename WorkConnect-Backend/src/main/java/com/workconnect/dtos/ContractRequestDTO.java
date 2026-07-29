package com.workconnect.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.workconnect.entities.ContractStatus;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContractRequestDTO {

    @NotNull(message = "Application Id is required")
    private Long applicationId;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date cannot be in the past")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDate endDate;

    @NotNull(message = "Agreed amount is required")
    @Positive(message = "Amount must be greater than zero")
    private BigDecimal agreedAmount;

    // Optional while creating
    private ContractStatus contractStatus;
}