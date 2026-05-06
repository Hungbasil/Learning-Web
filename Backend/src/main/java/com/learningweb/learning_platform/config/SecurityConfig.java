package com.learningweb.learning_platform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt bảo vệ CSRF để test Postman không bị lỗi
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Mở cửa tự do cho API đăng ký/đăng nhập
                        .anyRequest().authenticated() // Các API khác vẫn bắt buộc phải có vé (Token)
                );

        return http.build();
    }
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
