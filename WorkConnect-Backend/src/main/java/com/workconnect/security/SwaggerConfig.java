package com.workconnect.security;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;


@Configuration

@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT"
)

@OpenAPIDefinition(
        info = @Info(
                title = "WorkConnect API",
                version = "1.0",
                description = "JWT Authentication based Job Marketplace API"
        ),
        security = {
                @SecurityRequirement(name = "bearerAuth")
        }
)

public class SwaggerConfig {

}