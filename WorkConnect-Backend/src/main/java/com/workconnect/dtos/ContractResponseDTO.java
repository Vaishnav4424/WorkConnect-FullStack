package com.workconnect.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.workconnect.entities.ContractStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContractResponseDTO {

    private Long contractId;

    private Long applicationId;

    private Long jobId;

    private String jobTitle;

    private Long employerId;

    private String employerName;

    private Long workerId;

    private String workerName;

    private LocalDate startDate;

    private LocalDate endDate;

    private ContractStatus contractStatus;

    private BigDecimal agreedAmount;

    private List<Long> paymentIds;

    private Long reviewId;
}