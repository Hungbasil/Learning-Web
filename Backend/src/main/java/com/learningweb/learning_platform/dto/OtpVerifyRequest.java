package com.learningweb.learning_platform.dto;


import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class OtpVerifyRequest {
    private String email;
    private String otpCode;
}
