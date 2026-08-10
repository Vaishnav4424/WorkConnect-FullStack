package com.workconnect.custom_exceptions;

@SuppressWarnings("serial")
public class PaymentProcessingException extends RuntimeException {

    public PaymentProcessingException(String errMesg) {
        super(errMesg);
    }

    public PaymentProcessingException(String errMesg, Throwable cause) {
        super(errMesg, cause);
    }
}