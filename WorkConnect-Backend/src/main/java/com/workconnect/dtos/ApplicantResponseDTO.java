package com.workconnect.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.workconnect.entities.ApplicationStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplicantResponseDTO {

    private Long applicationId;

    // Worker Details
    private Long workerId;
    private String workerName;
    private String email;
    private Integer experienceYears;
    private String skillDescription;
    private BigDecimal hourlyRate;

    // Application Details
    private LocalDate appliedDate;
    private ApplicationStatus applicationStatus;
}