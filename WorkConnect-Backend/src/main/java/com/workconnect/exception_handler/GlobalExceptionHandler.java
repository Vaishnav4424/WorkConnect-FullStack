package com.workconnect.exception_handler;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.workconnect.custom_exceptions.AuthenticationException;
import com.workconnect.custom_exceptions.BadRequestException;
import com.workconnect.custom_exceptions.DuplicateResourceException;
import com.workconnect.custom_exceptions.InvalidInputException;
import com.workconnect.custom_exceptions.ResourceNotFoundException;
import com.workconnect.custom_exceptions.PaymentProcessingException;
import com.workconnect.dtos.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException ex) {

	    ErrorResponse response = new ErrorResponse(
	            LocalDateTime.now(),
	            "Failed",
	            ex.getMessage(),
	            null
	    );

	    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
	}

    // Resource Not Found Exception
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException e) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                "Failed",
                e.getMessage(),
                null);

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // Invalid Input Exception
    @ExceptionHandler(InvalidInputException.class)
    public ResponseEntity<ErrorResponse> handleInvalidInputException(InvalidInputException e) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                "Failed",
                e.getMessage(),
                null);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Authentication Exception
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException e) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                "Failed",
                e.getMessage(),
                null);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    // Access Denied Exception
/*    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException e) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                "Failed",
                "Access Denied",
                null);

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
*/    
    // Resource already exists exception
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateResourceException(DuplicateResourceException e) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                "Failed",
                e.getMessage(),
                null);

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }
    
    // Database Constraint Exception
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException e) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                "Failed",
                "Duplicate data or database constraint violation.",
                null);

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    // Validation Exception (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

        Map<String, String> fieldErrors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage,
                        (message1, message2) -> message1));

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                "Failed",
                "Validation Failed",
                fieldErrors);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    
    @ExceptionHandler(PaymentProcessingException.class)
    public ResponseEntity<ErrorResponse> handlePaymentProcessingException(PaymentProcessingException e) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                "Failed",
                e.getMessage(),
                null
        );

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Catch-All Exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(Exception e) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                "Failed",
                "Something went wrong. Please try again later.",
                null);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}

/**
Exception	                     Who creates it?	    Need to write class?
ResourceNotFoundException	       You	                  ✅ Yes
InvalidInputException	           You	                  ✅ Yes
AuthenticationException	           You	                  ✅ Yes
AccessDeniedException	           Spring Security	      ❌ No
MethodArgumentNotValidException	   Spring MVC	          ❌ No
DataIntegrityViolationException	   Spring Data JPA	      ❌ No
NullPointerException	           Java	                  ❌ No
SQLException	                   JDBC	                  ❌ No
 * 
 * 
 * 
 * 
 * 
 * 
 * 
@SuppressWarnings("serial") is used to suppress a compiler warning related to serialization.

Why does the warning appear?

Your custom exception usually extends RuntimeException or Exception.

Since RuntimeException implements the Serializable interface, your custom exception is also serializable.

Java expects every serializable class to declare a serialVersionUID.
 **/


