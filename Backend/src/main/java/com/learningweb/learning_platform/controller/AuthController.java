package com.learningweb.learning_platform.controller;

import com.learningweb.learning_platform.dto.RegisterRequest;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Lỗi: Email này đã được sử dụng!");
        }
        User newUser = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role("STUDENT")
                .build();
        userRepository.save(newUser);

        return ResponseEntity.ok("Đăng ký tài khoản thành công!");
    }
}
