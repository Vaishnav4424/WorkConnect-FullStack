package com.workconnect.service;

import com.workconnect.dtos.ApiResponse;
import com.workconnect.dtos.ChangePasswordDTO;
import com.workconnect.dtos.LoginRequestDTO;
import com.workconnect.dtos.LoginResponseDTO;
import com.workconnect.dtos.RegisterRequestDTO;

public interface AuthenticationService {

	ApiResponse registerUser(RegisterRequestDTO request);

    LoginResponseDTO authenticateUser(LoginRequestDTO request);

    ApiResponse changePassword(ChangePasswordDTO request);

    //ApiResponse forgotPassword(ForgotPasswordDTO request);

    //ApiResponse resetPassword(ResetPasswordDTO request);
    
}
