package com.workconnect.dtos;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.workconnect.entities.JobCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JobRequestDTO {

    @NotBlank(message = "Job title is required.")
    private String jobTitle;

    private String jobDescription;

    @NotNull(message = "Category is required.")
    private JobCategory category;

    @NotBlank(message = "Location is required.")
    private String location;

    @NotNull(message = "Budget is required.")
    private BigDecimal budget;

    @NotNull(message = "Deadline is required.")
    private LocalDate deadline;
}
