package com.workconnect.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployerRequestDTO {

    @NotNull
    private Long userId;

    @NotBlank(message = "Organization name is required")
    @Size(max = 100)
    private String organizationName;

    @Size(max = 500)
    private String organizationDescription;

    @NotBlank(message = "Organization address is required")
    @Size(max = 255)
    private String organizationAddress;

    @NotBlank(message = "City is required")
    @Size(max = 100)
    private String city;

    @NotBlank(message = "State is required")
    @Size(max = 100)
    private String state;

    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "\\d{6}", message = "Pincode must be exactly 6 digits")
    private String pincode;

    @Pattern(
        regexp = "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$",
        message = "Invalid GST number"
    )
    private String gstNumber;

    @NotBlank(message = "Contact person is required")
    @Size(max = 100)
    private String contactPerson;
}
