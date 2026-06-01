package com.learningweb.learning_platform.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import java.util.function.Function;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    // Chuỗi secrest key mẫu để test
    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 48))  // 48 hours
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    public String extractEmail(String token) {
        try {
            return extractClaim(token, Claims::getSubject);
        } catch (JwtException e) {
            System.err.println("[JwtService] Error extracting email: " + e.getMessage());
            return null;
        }
    }

    public boolean isTokenValid(String token, String userEmail) {
        try {
            final String email = extractEmail(token);
            if (email == null) return false;
            return (email.equals(userEmail) && !isTokenExpired(token));
        } catch (Exception e) {
            System.err.println("[JwtService] Error validating token: " + e.getMessage());
            return false;
        }
    }
    
    private boolean isTokenExpired(String token) {
        try {
            return extractClaim(token, Claims::getExpiration).before(new Date());
        } catch (Exception e) {
            System.err.println("[JwtService] Error checking expiration: " + e.getMessage());
            return true; // Treat as expired if error
        }
    }
    
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        try {
            final Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claimsResolver.apply(claims);
        } catch (JwtException e) {
            System.err.println("[JwtService] JWT parsing error: " + e.getMessage());
            throw e;
        }
    }
}
