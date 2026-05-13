package com.learningweb.learning_platform.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            // Sử dụng MimeMessage thay cho SimpleMailMessage để hỗ trợ mã HTML
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Cấu hình thông tin người gửi chuẩn xác định danh
            helper.setFrom("LearningVN Platform <quizwhite212@gmail.com>");
            helper.setTo(toEmail);
            helper.setSubject("🔒 [LearningVN] Mã xác thực tài khoản của bạn");

            // =================================================================
            // TEMPLATE HTML GIAO DIỆN KHỚP 100% ẢNH THIẾT KẾ
            // =================================================================
            String htmlContent = """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
                    
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 40px 0;">
                        <tr>
                            <td align="center">
                                
                                <h1 style="color: #007bff; font-size: 32px; margin-bottom: 24px; font-weight: bold;">
                                    LearningVN
                                </h1>

                                <table border="0" cellpadding="0" cellspacing="0" width="500" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 40px;">
                                    <tr>
                                        <td align="center">
                                            
                                            <h2 style="color: #1f2937; font-size: 24px; margin: 0 0 16px 0;">
                                                Chào mừng bạn! 👋
                                            </h2>
                                            
                                            <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;">
                                                Cảm ơn bạn đã đăng ký tài khoản LearningVN.<br>
                                                Chỉ còn một bước nữa để hoàn tất đăng ký!
                                            </p>

                                            <a href="http://localhost:5173/verify-otp?email=%s" target="_blank" style="display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 32px; border-radius: 6px; margin-bottom: 32px;">
                                                Xác minh email của tôi
                                            </a>

                                            <p style="color: #9ca3af; font-size: 13px; margin: 0 0 12px 0;">
                                                Hoặc nhập mã xác minh này:
                                            </p>

                                            <div style="border: 2px dashed #007bff; border-radius: 8px; padding: 16px; width: 80%%; margin-bottom: 32px; background-color: #f8fafc;">
                                                <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 12px;">
                                                    %s
                                                </span>
                                            </div>

                                            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                                                Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
                                            </p>

                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>
                    </table>

                </body>
                </html>
                """.formatted(toEmail, otpCode);

            helper.setText(htmlContent, true);

            // Gửi mail đi
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi khi gửi email xác thực: " + e.getMessage());
        }
    }
}