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
        // 1. Viết "Lời nguyền" (Prompt) thiết kế lộ trình
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

}
