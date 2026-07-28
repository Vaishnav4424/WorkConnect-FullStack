package com.workconnect.dtos;

import java.time.LocalDate;

import com.workconnect.entities.ApplicationStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JobApplicationResponseDTO {

    private Long applicationId;

    private Long jobId;
    private Long workerId;

    private LocalDate appliedDate;

    private ApplicationStatus status;
}