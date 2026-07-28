package com.workconnect.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {

    private String message;

    private String token;

    private String tokenType;

    private Long userId;

    private String firstName;
    
    private String lastName;

    private String email;

    private String role;

}