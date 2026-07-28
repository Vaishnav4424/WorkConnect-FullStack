package com.workconnect.custom_exceptions;

@SuppressWarnings("serial")
public class DuplicateResourceException extends RuntimeException  {

	public DuplicateResourceException(String mesg) {
		super(mesg);
	}

}
