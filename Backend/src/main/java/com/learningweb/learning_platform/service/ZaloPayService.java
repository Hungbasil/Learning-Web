package com.learningweb.learning_platform.service;


import com.learningweb.learning_platform.entity.PaymentTransaction;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.dto.ZaloPayOrderResponse;
import com.learningweb.learning_platform.repository.PaymentTransactionRepository;
import com.learningweb.learning_platform.utils.HMACUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Map;
import java.util.TimeZone;

@Service
public class ZaloPayService {

    // Lấy các cấu hình từ file application.properties
    @Value("${zalopay.app-id}")
    private String appId;

    @Value("${zalopay.key1}")
    private String key1;

    @Value("${zalopay.endpoint.create}")
    private String endpointCreate;

    @Autowired
    private PaymentTransactionRepository paymentRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    public ZaloPayOrderResponse createOrder(User user, Long amount, String orderInfo) {
        try {
            String transId = getCurrentTimeString("yyMMdd") + "_" + System.currentTimeMillis();

            String appTime = String.valueOf(System.currentTimeMillis());
            String appUser = String.valueOf(user.getId());
            String embedData = "{\"redirecturl\": \"http://localhost:5173/payment-success\"}";
            String item = "[{\"itemname\": \"" + orderInfo + "\", \"itemprice\": " + amount + ", \"itemquantity\": 1}]";
            String macData = appId + "|" + transId + "|" + appUser  + "|" + amount + "|" + appTime + "|" + embedData + "|" + item;
            String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMAC_SHA256, key1, macData);


            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("app_id", appId);
            body.add("app_trans_id", transId);
            body.add("app_user", appUser);
            body.add("app_time", appTime);
            body.add("item", item);
            body.add("embed_data", embedData);
            body.add("amount", String.valueOf(amount));
            body.add("description", orderInfo);
            body.add("bank_code", "");
            body.add("mac", mac);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            Map<String, Object> response = restTemplate.postForObject(endpointCreate, request, Map.class);

            if (response != null && (Integer) response.get("return_code") == 1) {
                // Return order URL directly - don't create transaction here
                // Transaction will be created in PaymentController
                String orderUrl = (String) response.get("order_url");
                System.out.println("[ZaloPayService] Order created successfully: " + transId);
                System.out.println("[ZaloPayService] Order URL: " + orderUrl);
                return ZaloPayOrderResponse.builder()
                        .orderUrl(orderUrl)
                        .appTransId(transId)
                        .success(true)
                        .build();
            }

            String errorMsg = response != null ? response.toString() : "ZaloPay API returned null";
            System.out.println("[ZaloPayService] ZaloPay API returned error. Response: " + errorMsg);
            return ZaloPayOrderResponse.builder()
                    .success(false)
                    .errorMessage(errorMsg)
                    .build();
        } catch (Exception e) {
            System.out.println("[ZaloPayService] Error calling ZaloPay: " + e.getMessage());
            e.printStackTrace();
            return ZaloPayOrderResponse.builder()
                    .success(false)
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    //  sinh định dạng thời gian
    private String getCurrentTimeString(String format) {
        Calendar cal = new GregorianCalendar(TimeZone.getTimeZone("GMT+7"));
        SimpleDateFormat fmt = new SimpleDateFormat(format);
        fmt.setCalendar(cal);
        return fmt.format(cal.getTimeInMillis());
    }
}
