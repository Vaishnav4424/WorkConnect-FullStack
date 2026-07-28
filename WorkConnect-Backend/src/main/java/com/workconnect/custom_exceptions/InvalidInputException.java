package com.workconnect.custom_exceptions;

@SuppressWarnings("serial")
public class InvalidInputException extends RuntimeException {

	public InvalidInputException(String mesg) {
		super(mesg);
	}

}
