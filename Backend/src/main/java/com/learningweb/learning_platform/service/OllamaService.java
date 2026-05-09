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
        String prompt = "Bạn là một chuyên gia Senior Developer. Hãy chấm điểm đoạn code sau (thang điểm 100) và đưa ra nhận xét ngắn gọn.\n" +
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
}
