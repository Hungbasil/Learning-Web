package com.learningweb.learning_platform.controller;



import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.service.ZaloPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private ZaloPayService zaloPayService;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(
            @RequestParam Long amount,
            @RequestParam String orderInfo) {

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        System.out.println("⏳ Đang kết nối với ZaloPay để tạo đơn...");

        String paymentUrl = zaloPayService.createOrder(currentUser, amount, orderInfo);

        if (paymentUrl != null) {
            System.out.println(" Tạo đơn thành công!");
            Map<String, String> response = new HashMap<>();
            response.put("payUrl", paymentUrl);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("Lỗi: Không thể kết nối với cổng thanh toán lúc này.");
    }
}
