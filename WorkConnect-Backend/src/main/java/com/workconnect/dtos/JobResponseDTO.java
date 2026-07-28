package com.workconnect.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.workconnect.entities.JobCategory;
import com.workconnect.entities.JobStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobResponseDTO {

    private Long jobPostId;

    private String jobTitle;

    private String jobDescription;

    private JobCategory category;

    private String location;

    private BigDecimal budget;

    private LocalDate deadline;

    private LocalDate postedDate;

    private JobStatus status;

    // Client details
    private Long employerId;
    private String employerName;
}