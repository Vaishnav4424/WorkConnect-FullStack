package com.workconnect.dtos;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkerRequestDTO {

    //not Required jwt anuthenitication userId not teveled in the request body
    @NotNull
    private Long userId;

    @NotBlank
    private String skillDescription;

    @Min(0)
    private int experienceYears;

    @PositiveOrZero
    private BigDecimal hourlyRate;

    private String profileDescription;

}
