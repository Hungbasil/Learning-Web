package com.learningweb.learning_platform.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.learningweb.learning_platform.entity.PaymentTransaction;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.entity.Course;
import com.learningweb.learning_platform.repository.PaymentTransactionRepository;
import com.learningweb.learning_platform.repository.PricingPackageRepository;
import com.learningweb.learning_platform.repository.CourseRepository;
import com.learningweb.learning_platform.service.ZaloPayService;
import com.learningweb.learning_platform.repository.UserRepository;
import com.learningweb.learning_platform.utils.HMACUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
    @Autowired
    private CourseRepository courseRepository;

    @Value("${zalopay.key2}")
    private String key2;

    // ============ EXISTING ENDPOINTS ============

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

    // ============ NEW ENDPOINTS FOR COURSE & PREMIUM ============

    @PostMapping("/course/{courseId}")
    public ResponseEntity<?> createCoursePayment(@PathVariable Long courseId) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Course course = courseRepository.findById(courseId).orElse(null);

        if (course == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy khóa học");
        }

        if (course.getPrice() == null || course.getPrice() <= 0) {
            return ResponseEntity.badRequest().body("Khóa học này không có giá");
        }

        // Create payment transaction
        PaymentTransaction tx = PaymentTransaction.builder()
                .user(currentUser)
                .course(course)
                .amount((long) (course.getPrice() * 1000)) // Convert to VND
                .description("Mua khóa học: " + course.getTitle())
                .paymentType("COURSE")
                .status("PENDING")
                .build();

        paymentRepository.save(tx);

        // Create ZaloPay order
        String paymentUrl = zaloPayService.createOrder(currentUser, tx.getAmount(), 
                "Mua khóa học " + course.getTitle());

        if (paymentUrl != null) {
            tx.setAppTransId(paymentUrl.split("apptransid=")[1].split("&")[0]);
            paymentRepository.save(tx);
            Map<String, Object> response = new HashMap<>();
            response.put("payUrl", paymentUrl);
            response.put("transactionId", tx.getId());
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("Lỗi: Không thể kết nối với cổng thanh toán");
    }

    @PostMapping("/premium/{months}")
    public ResponseEntity<?> createPremiumPayment(@PathVariable Integer months) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (months < 1 || months > 12) {
            return ResponseEntity.badRequest().body("Thời hạn premium không hợp lệ (1-12 tháng)");
        }

        // Pricing: 99,000 VND/month
        long amount = (long) months * 99000 * 1000; // Convert to VND

        PaymentTransaction tx = PaymentTransaction.builder()
                .user(currentUser)
                .amount(amount)
                .description("Nâng cấp Premium " + months + " tháng")
                .paymentType("PREMIUM")
                .premiumMonths(months)
                .status("PENDING")
                .build();

        paymentRepository.save(tx);

        // Create ZaloPay order
        String paymentUrl = zaloPayService.createOrder(currentUser, tx.getAmount(),
                "Nâng cấp Premium " + months + " tháng");

        if (paymentUrl != null) {
            tx.setAppTransId(paymentUrl.split("apptransid=")[1].split("&")[0]);
            paymentRepository.save(tx);
            Map<String, Object> response = new HashMap<>();
            response.put("payUrl", paymentUrl);
            response.put("transactionId", tx.getId());
            response.put("amount", amount / 1000); // Return amount in VND
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.badRequest().body("Lỗi: Không thể kết nối với cổng thanh toán");
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<PaymentTransaction> transactions = paymentRepository.findByUserOrderByCreatedAtDesc(currentUser);
        
        List<Map<String, Object>> history = transactions.stream()
                .map(tx -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", tx.getId());
                    map.put("type", tx.getPaymentType());
                    map.put("description", tx.getDescription());
                    map.put("amount", tx.getAmount() / 1000); // Convert back to VND
                    map.put("status", tx.getStatus());
                    map.put("createdAt", tx.getCreatedAt());
                    map.put("paidAt", tx.getPaidAt());
                    if (tx.getCourse() != null) {
                        map.put("courseTitle", tx.getCourse().getTitle());
                    }
                    if (tx.getPremiumMonths() != null) {
                        map.put("premiumMonths", tx.getPremiumMonths());
                    }
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(history);
    }

    // ============ ZALOPAY CALLBACK ============

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

                // Handle different payment types
                if ("PREMIUM".equals(tx.getPaymentType())) {
                    // Update premium status
                    LocalDateTime expiryDate = LocalDateTime.now().plusMonths(tx.getPremiumMonths());
                    user.setIsPremium(true);
                    user.setPremiumExpiryDate(expiryDate);
                    userRepository.save(user);
                    System.out.println(" [Premium] Khách " + user.getEmail() + " nâng cấp Premium đến " + expiryDate);
                } else if ("COURSE".equals(tx.getPaymentType())) {
                    // Handle course enrollment (add to user's enrolled courses)
                    System.out.println(" [Course] Khách " + user.getEmail() + " mua khóa học " + tx.getCourse().getTitle());
                } else if ("AI_TOKENS".equals(tx.getPaymentType())) {
                    // Add AI tokens
                    long amountPaid = tx.getAmount();
                    pricingRepository.findBestFitPackage(amountPaid).ifPresent(pkg -> {
                        user.setAiTokens(user.getAiTokens() + pkg.getTokens());
                        userRepository.save(user);
                        System.out.println(" [Tokens] Khách " + user.getEmail() + " mua: " + pkg.getPackageName());
                    });
                }
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