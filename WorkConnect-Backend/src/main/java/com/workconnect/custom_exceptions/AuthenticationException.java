package com.workconnect.custom_exceptions;

@SuppressWarnings("serial")
public class AuthenticationException extends RuntimeException {

	public AuthenticationException(String mesg) {
		super(mesg);
	}
	
}


