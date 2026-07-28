package com.workconnect.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.workconnect.entities.ApplicationStatus;
import com.workconnect.entities.JobCategory;
import com.workconnect.entities.JobStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AppliedJobResponseDTO {

    private Long applicationId;

    // Job Details
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private JobCategory category;
    private String location;
    private BigDecimal budget;
    private LocalDate deadline;
    private JobStatus jobStatus;

    // Application Details
    private LocalDate appliedDate;
    private ApplicationStatus applicationStatus;
}