package com.workconnect.dtos;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {

    private LocalDateTime timestamp;

    private int statusCode;

    private ResponseStatus status;

    private String message;

    public static ApiResponse success(String message) {
        return new ApiResponse(
                LocalDateTime.now(),
                200,
                ResponseStatus.SUCCESS,
                message
        );
    }

    public static ApiResponse created(String message) {
        return new ApiResponse(
                LocalDateTime.now(),
                201,
                ResponseStatus.SUCCESS,
                message
        );
    }

    public static ApiResponse error(String message) {
        return new ApiResponse(
                LocalDateTime.now(),
                400,
                ResponseStatus.ERROR,
                message
        );
    }
}