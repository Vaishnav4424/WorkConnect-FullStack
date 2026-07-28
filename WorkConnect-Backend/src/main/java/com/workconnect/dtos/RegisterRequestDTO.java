package com.workconnect.dtos;

import com.workconnect.entities.Role;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString

public class RegisterRequestDTO {

    @NotBlank(message = "First name is required.")
    @Size(max = 30, message = "First name cannot exceed 30 characters.")
    private String firstName;

    @NotBlank(message = "Last name is required.")
    @Size(max = 30, message = "Last name cannot exceed 30 characters.")
    private String lastName;

    @NotBlank(message = "Email is required.")
    @Email(message = "Invalid email format.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,20}$",
        message = "Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be 8-20 characters long."
    )
    private String password;

    @NotBlank(message = "Phone number is required.")
    @Pattern(
        regexp = "^[0-9]{10}$",
        message = "Phone number must contain exactly 10 digits."
    )
    private String phoneNumber;

    @NotBlank(message = "Address is required.")
    @Size(max = 255, message = "Address cannot exceed 255 characters.")
    private String address;

    @NotNull(message = "Role is required.")
    private Role role;
}
