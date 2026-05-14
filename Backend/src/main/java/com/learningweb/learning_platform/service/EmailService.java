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

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("LearningVN Platform <quizwhite212@gmail.com>");
            helper.setTo(toEmail);
            helper.setSubject("🔒 [LearningVN] Mã xác thực tài khoản của bạn");

String htmlContent = "<!DOCTYPE html>\n" +
            "<html>\n" +
            "<head>\n" +
            "    <meta charset=\"UTF-8\">\n" +
            "</head>\n" +
            "<body style=\"margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;\">\n" +
            "    <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"padding: 40px 0;\">\n" +
            "        <tr>\n" +
            "            <td align=\"center\">\n" +
            "                <h1 style=\"color: #007bff; font-size: 32px; margin-bottom: 24px; font-weight: bold;\">\n" +
            "                    LearningVN\n" +
            "                </h1>\n" +
            "                <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"500\" style=\"background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); padding: 40px;\">\n" +
            "                    <tr>\n" +
            "                        <td align=\"center\">\n" +
            "                            <h2 style=\"color: #1f2937; font-size: 24px; margin: 0 0 16px 0;\">\n" +
            "                                Chào mừng bạn! 👋\n" +
            "                            </h2>\n" +
            "                            <p style=\"color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; text-align: center;\">\n" +
            "                                Cảm ơn bạn đã đăng ký tài khoản LearningVN.<br>\n" +
            "                                Chỉ còn một bước nữa để hoàn tất đăng ký!\n" +
            "                            </p>\n" +
            "                            <a href=\"http://localhost:5173/otp-verification?email=" + toEmail + "\" target=\"_blank\" style=\"display: inline-block; background-color: #007bff; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: bold; padding: 14px 32px; border-radius: 6px; margin-bottom: 32px;\">\n" +
            "                                Xác minh email của tôi\n" +
            "                            </a>\n" +
            "                            <p style=\"color: #9ca3af; font-size: 13px; margin: 0 0 12px 0;\">\n" +
            "                                Hoặc nhập mã xác minh này:\n" +
            "                            </p>\n" +
            "                            <div style=\"border: 2px dashed #007bff; border-radius: 8px; padding: 16px; width: 80%; margin-bottom: 32px; background-color: #f8fafc;\">\n" +
            "                                <span style=\"font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 12px;\">\n" +
            "                                    " + otpCode + "\n" +
            "                                </span>\n" +
            "                            </div>\n" +
            "                            <p style=\"color: #9ca3af; font-size: 12px; margin: 0;\">\n" +
            "                                Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.\n" +
            "                            </p>\n" +
            "                        </td>\n" +
            "                    </tr>\n" +
            "                </table>\n" +
            "            </td>\n" +
            "        </tr>\n" +
            "    </table>\n" +
            "</body>\n" +
            "</html>";

            helper.setText(htmlContent, true);

            // Gửi mail đi
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi khi gửi email xác thực: " + e.getMessage());
        }
    }
}