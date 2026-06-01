package com.learningweb.learning_platform.controller;

import com.learningweb.learning_platform.dto.LoginRequest;
import com.learningweb.learning_platform.dto.OtpVerifyRequest;
import com.learningweb.learning_platform.dto.RegisterRequest;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.UserRepository;
import com.learningweb.learning_platform.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.learningweb.learning_platform.security.JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        // Kiểm tra trùng lặp email
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Lỗi: Email đã được sử dụng!");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");
        user.setIsEmailVerified(false);

        String generatedOtp = String.valueOf((int) (Math.random() * 900000) + 100000);
        user.setOtpCode(generatedOtp);
        user.setOtpExpiryTime(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        emailService.sendOtpEmail(user.getEmail(), generatedOtp);

        return ResponseEntity.ok("Đăng ký sơ bộ thành công! Vui lòng kiểm tra Email để lấy mã OTP.");
    }

    // XÁC THỰC OTP KÍCH HOẠT TÀI KHOẢN
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyRequest request) {
        // Tìm user theo email
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("Tài khoản không tồn tại.");
        }
        if (user.getIsEmailVerified()) {
            return ResponseEntity.badRequest().body("Tài khoản này đã được kích hoạt trước đó.");
        }

        if (user.getOtpCode() == null || !user.getOtpCode().equals(request.getOtpCode())) {
            return ResponseEntity.badRequest().body("Mã xác thực không chính xác.");
        }

        // Kiểm tra thời gian hết hạn
        if (user.getOtpExpiryTime().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Mã xác thực đã hết hạn. Vui lòng yêu cầu gửi lại.");
        }

        user.setIsEmailVerified(true);
        user.setOtpCode(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);
        return ResponseEntity.ok("Xác thực Email thành công! Tài khoản của bạn đã được kích hoạt.");
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        java.util.Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Lỗi: Tài khoản không tồn tại!");
        }
        User user = userOptional.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Lỗi: Sai mật khẩu!");
        }

        // Kiểm tra tài khoản đã xác thực Email
        if (!user.getIsEmailVerified()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Lỗi: Tài khoản chưa xác thực. Vui lòng kiểm tra Email để nhập mã OTP!");
        }

        String token = jwtService.generateToken(user.getEmail());

        // Map/DTO trả về để Zustand Store
        java.util.Map<String, Object> responseData = new java.util.HashMap<>();
        responseData.put("token", token);

        java.util.Map<String, Object> userData = new java.util.HashMap<>();
        userData.put("id", user.getId());
        userData.put("email", user.getEmail());
        userData.put("fullName", user.getFullName());
        userData.put("role", user.getRole());
        userData.put("aiTokens", 5);
        userData.put("totalXp", 0);

        responseData.put("user", userData);

        return ResponseEntity.ok(responseData);
    }
}
