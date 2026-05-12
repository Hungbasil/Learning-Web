package com.learningweb.learning_platform.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learningweb.learning_platform.entity.PaymentTransaction;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.PaymentTransactionRepository;
import com.learningweb.learning_platform.repository.PricingPackageRepository;
import com.learningweb.learning_platform.service.ZaloPayService;
import com.learningweb.learning_platform.repository.UserRepository;
import com.learningweb.learning_platform.utils.HMACUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private ZaloPayService zaloPayService;

    @Autowired
    private PaymentTransactionRepository paymentRepository;
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private PricingPackageRepository pricingRepository;

    @Value("${zalopay.key2}")
    private String key2;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestParam Long amount, @RequestParam String orderInfo) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String paymentUrl = zaloPayService.createOrder(currentUser, amount, orderInfo);
        if (paymentUrl != null) {
            Map<String, String> response = new HashMap<>();
            response.put("payUrl", paymentUrl);
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body("Lỗi: Không thể kết nối với cổng thanh toán lúc này.");
    }

    @PostMapping("/callback")
    public ResponseEntity<?> callback(@RequestBody String jsonStr) {
        Map<String, Object> result = new HashMap<>();
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode reqNode = mapper.readTree(jsonStr);
            String dataStr = reqNode.get("data").asText();
            String reqMac = reqNode.get("mac").asText();


             String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMAC_SHA256, key2, dataStr);
            if (!mac.equals(reqMac)) {
                result.put("return_code", -1);
                result.put("return_message", "mac not equal");
                return ResponseEntity.ok(result);
            }

            JsonNode dataNode = mapper.readTree(dataStr);
            String appTransId = dataNode.get("app_trans_id").asText();

            PaymentTransaction tx = paymentRepository.findByAppTransId(appTransId).orElse(null);
            if (tx != null) {
                tx.setStatus("SUCCESS");
                tx.setPaidAt(LocalDateTime.now());
                paymentRepository.save(tx);
                User user = tx.getUser();
                long amountPaid = tx.getAmount();

                pricingRepository.findBestFitPackage(amountPaid).ifPresent(pkg -> {
                    user.setAiTokens(user.getAiTokens() + pkg.getTokens());
                    userRepository.save(user);
                    System.out.println(" Khách đã mua: " + pkg.getPackageName() + " - Cộng " + pkg.getTokens() + " lượt AI.");
                });
            }

            result.put("return_code", 1);
            result.put("return_message", "success");

        } catch (Exception ex) {
            result.put("return_code", 0);
            result.put("return_message", ex.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}