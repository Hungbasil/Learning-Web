package com.learningweb.learning_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ZaloPayOrderResponse {
    private String orderUrl;
    private String appTransId;
    private boolean success;
    private String errorMessage;
}
