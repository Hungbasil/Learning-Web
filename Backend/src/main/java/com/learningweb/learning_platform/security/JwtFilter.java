package com.learningweb.learning_platform.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import com.learningweb.learning_platform.entity.User;
import com.learningweb.learning_platform.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Optional;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter { // OncePerRequestFilter: Lọc mỗi request 1 lần

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            final String authHeader = request.getHeader("Authorization");
            final String jwt;
            final String userEmail;
            
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            jwt = authHeader.substring(7);
            userEmail = jwtService.extractEmail(jwt); // Có thể trả về null nếu token invalid

            // Nếu đọc được email mà chưa được hệ thống ghi nhận
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                Optional<User> userOptional = userRepository.findByEmail(userEmail);

                if (userOptional.isPresent()) {
                    User user = userOptional.get();

                    // kiểm tra hợp lệ không
                    if (jwtService.isTokenValid(jwt, user.getEmail())) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
                        );
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            System.err.println("[JwtFilter] Error processing JWT: " + e.getMessage());
            filterChain.doFilter(request, response); // Continue without auth if error
        }
    }
}
