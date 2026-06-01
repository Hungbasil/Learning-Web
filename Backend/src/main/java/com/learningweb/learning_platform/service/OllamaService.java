package com.learningweb.learning_platform.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class OllamaService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> gradeCodeAnswer(String question, String answer) {
        String prompt = "Bạn là một chuyên gia Senior Developer. Hãy chấm điểm đoạn code sau (thang điểm 100) và đưa ra nhận xét ngắn gọn bằng tiếng việt\n" +
                "Câu hỏi: " + question + "\n" +
                "Câu trả lời của ứng viên: " + answer + "\n" +
                "YÊU CẦU BẮT BUỘC: Chỉ trả về duy nhất 1 chuỗi JSON chuẩn xác theo format sau, không giải thích, không thêm ký tự nào khác: {\"score\": 85, \"feedback\": \"Code chạy tốt, nhưng có thể tối ưu vòng lặp.\"}";

        // 2. Gói hàng gửi cho Ollama
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "mistral");
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);
        requestBody.put("format", "json");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {

            ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:11434/api/generate", request, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            String responseText = root.get("response").asText();

            JsonNode aiResult = objectMapper.readTree(responseText);
            Map<String, Object> result = new HashMap<>();
            result.put("score", aiResult.get("score").asInt());
            result.put("feedback", aiResult.get("feedback").asText());

            return result;
        } catch (Exception e) {
            System.out.println(" Lỗi: " + e.getMessage());
            return null;
        }
    }

    public String generateLearningPath(com.learningweb.learning_platform.dto.LearningPathRequest request) {
        String prompt = String.format(
                "Bạn là một chuyên gia IT Mentor xuất sắc. Hãy thiết kế một lộ trình học tập chi tiết bằng tiếng Việt cho học viên với các thông tin sau:\n" +
                        "- Kỹ năng muốn học: %s\n" +
                        "- Trình độ hiện tại: %s\n" +
                        "- Mục tiêu: %s\n" +
                        "- Thời gian học: %s\n\n" +
                        "YÊU CẦU BẮT BUỘC:\n" +
                        "1. Viết dưới dạng Markdown (sử dụng heading, in đậm, bullet points).\n" +
                        "2. Chia lộ trình thành các Tuần/Tháng rõ ràng.\n" +
                        "3. Đề xuất một mini-project ở cuối lộ trình để thực hành.\n" +
                        "4. KHÔNG trả về định dạng JSON, chỉ trả về nội dung bài viết Markdown thuần túy.",
                request.getTargetLanguage(), request.getCurrentLevel(),
                request.getStudyGoal(), request.getHoursPerWeek()
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "mistral");
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:11434/api/generate", entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            return root.get("response").asText();
        } catch (Exception e) {
            System.out.println(" Lỗi sinh lộ trình AI: " + e.getMessage());
            return null;
        }
    }

    // Hàm phân tích code
    public String analyzeCode(String challengeTitle, String description, String language, String code) {
        String prompt = String.format(
                "Bạn là một Mentor lập trình cực kỳ khắt khe nhưng tận tâm. Hãy phân tích đoạn code sau của ứng viên:\n" +
                        "- Bài toán: %s\n" +
                        "- Yêu cầu: %s\n" +
                        "- Ngôn ngữ: %s\n" +
                        "- Code ứng viên viết:\n```%s\n%s\n```\n\n" +
                        "YÊU CẦU TRẢ LỜI:\n" +
                        "1. Chỉ ra lỗi sai (cú pháp, logic, hoặc định dạng chuỗi output).\n" +
                        "2. Đưa ra gợi ý hướng sửa nhưng TUYỆT ĐỐI KHÔNG viết sẵn đoạn code giải pháp hoàn chỉnh để học viên tự suy nghĩ.\n" +
                        "3. Trả về bằng tiếng Việt, dùng định dạng Markdown.",
                challengeTitle, description, language, language, code
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "mistral");
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:11434/api/generate", entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            return root.get("response").asText();
        } catch (Exception e) {
            System.out.println("❌ Lỗi kết nối Ollama phân tích code: " + e.getMessage());
            return " [Hệ thống]: Không thể kết nối với AI Mentor lúc này. Vui lòng thử lại sau!";
        }
    }

    // Hàm phân tích Interview Answers
    public Map<String, Object> analyzeInterviewAnswers(String interviewTitle, java.util.List<java.util.Map<String, Object>> answers) {
        // Kiểm tra nếu tất cả answers đều trống
        boolean hasContent = answers.stream()
                .anyMatch(a -> {
                    String userAnswer = (String) a.get("userAnswer");
                    return userAnswer != null && !userAnswer.trim().isEmpty();
                });

        if (!hasContent) {
            Map<String, Object> result = new HashMap<>();
            result.put("status", "skipped");
            result.put("message", "Xin lỗi tôi không thể đưa ra câu trả lời nếu bạn không viết gì");
            result.put("strengths", new java.util.ArrayList<>());
            result.put("improvements", new java.util.ArrayList<>());
            return result;
        }

        // Xây dựng prompt phân tích
        StringBuilder answerText = new StringBuilder();
        for (java.util.Map<String, Object> answer : answers) {
            String question = (String) answer.get("question");
            String userAnswer = (String) answer.get("userAnswer");
            if (userAnswer != null && !userAnswer.trim().isEmpty()) {
                answerText.append("Câu hỏi: ").append(question).append("\n");
                answerText.append("Câu trả lời: ").append(userAnswer).append("\n\n");
            }
        }

        String prompt = "Bạn là một chuyên gia phỏng vấn kỹ thuật. Hãy phân tích các câu trả lời phỏng vấn sau của ứng viên:\n\n" +
                "Tên bài phỏng vấn: " + interviewTitle + "\n\n" +
                answerText.toString() + "\n" +
                "YÊU CẦU PHÂN TÍCH:\n" +
                "1. Xác định trạng thái: 'correct' (toàn đúng), 'wrong' (toàn sai/chưa đúng), hoặc 'partial' (vừa đúng vừa sai).\n" +
                "2. Liệt kê 2-3 điểm mạnh (nếu có), mỗi dòng 1 điểm, ngắn gọn dưới 15 từ.\n" +
                "3. Liệt kê 2-3 chỗ cần cải thiện, mỗi dòng 1 điểm, ngắn gọn dưới 15 từ.\n" +
                "4. Nếu skip (không viết gì): bỏ qua điểm mạnh và cần cải thiện.\n" +
                "Trả về JSON duy nhất chuẩn xác: {\"status\": \"correct|wrong|partial|skipped\", \"strengths\": [\"...\", \"...\"], \"improvements\": [\"...\", \"...\"], \"message\": \"...\"}";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "mistral");
        requestBody.put("prompt", prompt);
        requestBody.put("stream", false);
        requestBody.put("format", "json");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:11434/api/generate", request, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());
            String responseText = root.get("response").asText();

            JsonNode aiResult = objectMapper.readTree(responseText);
            Map<String, Object> result = new HashMap<>();
            result.put("status", aiResult.get("status").asText());
            result.put("message", aiResult.has("message") ? aiResult.get("message").asText() : "");

            java.util.List<String> strengths = new java.util.ArrayList<>();
            if (aiResult.has("strengths") && aiResult.get("strengths").isArray()) {
                aiResult.get("strengths").forEach(item -> strengths.add(item.asText()));
            }
            result.put("strengths", strengths);

            java.util.List<String> improvements = new java.util.ArrayList<>();
            if (aiResult.has("improvements") && aiResult.get("improvements").isArray()) {
                aiResult.get("improvements").forEach(item -> improvements.add(item.asText()));
            }
            result.put("improvements", improvements);

            return result;
        } catch (Exception e) {
            System.out.println("❌ Lỗi phân tích interview: " + e.getMessage());
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("status", "error");
            errorResult.put("message", "Không thể kết nối với AI Mentor lúc này");
            errorResult.put("strengths", new java.util.ArrayList<>());
            errorResult.put("improvements", new java.util.ArrayList<>());
            return errorResult;
        }
    }

}
