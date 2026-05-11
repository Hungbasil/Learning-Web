package com.learningweb.learning_platform.service;

import com.learningweb.learning_platform.entity.*;
import com.learningweb.learning_platform.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class CodeEvaluationService {

    @Autowired private CodeSubmissionRepository submissionRepository;
    @Autowired private UserRepository userRepository;

    public CodeSubmission evaluateSubmission(User user, CodeChallenge challenge, String code, String language) {
        List<TestCase> testCases = challenge.getTestCases();
        boolean allPassed = true;
        String executionError = "";

        for (TestCase tc : testCases) {
            File tempScript = null;
            File tempJavaDir = null;
            ProcessBuilder pb = null;

            try {
                // =========================================================================
                // BỘ ĐỊNH TUYẾN: CHỌN TRÌNH BIÊN DỊCH VÀ ÉP CHUẨN GHI FILE UTF-8
                // =========================================================================
                switch (language.toLowerCase()) {
                    case "python":
                    case "python3":
                        tempScript = File.createTempFile("sub_", ".py");
                        // 1. Ghi file rõ ràng bằng UTF-8
                        Files.writeString(tempScript.toPath(), code, StandardCharsets.UTF_8);
                        pb = new ProcessBuilder("python", tempScript.getAbsolutePath());

                        pb.environment().put("PYTHONIOENCODING", "utf-8");
                        break;

                    case "javascript":
                    case "js":
                        tempScript = File.createTempFile("sub_", ".js");
                        Files.writeString(tempScript.toPath(), code, StandardCharsets.UTF_8);
                        pb = new ProcessBuilder("node", tempScript.getAbsolutePath());
                        break;

                    case "java":
                        Path tempDirPath = Files.createTempDirectory("java_sub_");
                        tempJavaDir = tempDirPath.toFile();
                        tempScript = new File(tempJavaDir, "Solution.java");
                        Files.writeString(tempScript.toPath(), code, StandardCharsets.UTF_8);
                        pb = new ProcessBuilder("java", "-Dfile.encoding=UTF-8", tempScript.getAbsolutePath());
                        break;

                    default:
                        throw new IllegalArgumentException("Ngôn ngữ '" + language + "' hiện tại chưa được Engine hỗ trợ chấm tự động.");
                }

                pb.redirectErrorStream(true);
                Process process = pb.start();

                if (tc.getInputData() != null && !tc.getInputData().isEmpty()) {
                    try (OutputStream os = process.getOutputStream();
                         BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, StandardCharsets.UTF_8))) {
                        writer.write(tc.getInputData());
                        writer.flush();
                    }
                }

                boolean finished = process.waitFor(5, TimeUnit.SECONDS);
                if (!finished) {
                    process.destroy();
                    allPassed = false;
                    executionError = "Time Limit Exceeded (Quá thời gian thực thi 5 giây)";
                    break;
                }

                String actualOutput = readProcessOutput(process.getInputStream()).trim();
                String expectedOutput = tc.getExpectedOutput().trim();

                if (!actualOutput.equals(expectedOutput)) {
                    allPassed = false;
                    executionError = "Output không khớp. Thực tế in ra:\n" + actualOutput;
                    break;
                }

            } catch (IllegalArgumentException e) {
                allPassed = false;
                executionError = e.getMessage();
                break;
            } catch (Exception e) {
                allPassed = false;
                executionError = "Runtime Error: " + e.getMessage();
                break;
            } finally {
                if (tempScript != null && tempScript.exists()) {
                    tempScript.delete();
                }
                if (tempJavaDir != null && tempJavaDir.exists()) {
                    tempJavaDir.delete();
                }
            }
        }

        String finalStatus = allPassed ? "ACCEPTED" : "WRONG_ANSWER";

        CodeSubmission submission = CodeSubmission.builder()
                .user(user)
                .challenge(challenge)
                .submittedCode(code)
                .language(language)
                .status(finalStatus)
                .build();
        submissionRepository.save(submission);

        if (allPassed) {
            int xpReward = (challenge.getXpReward() != null) ? challenge.getXpReward() : 75;
            user.setTotalXp((user.getTotalXp() == null ? 0 : user.getTotalXp()) + xpReward);
            userRepository.save(user);
            System.out.println("🚀 [Thực chiến] Code " + language + " chạy chuẩn 100%! Đã cộng " + xpReward + " XP.");
        } else {
            System.out.println("⚠️ Code " + language + " sai: " + executionError);
        }

        return submission;
    }

    private String readProcessOutput(InputStream inputStream) throws IOException {
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line).append("\n");
            }
        }
        return sb.toString();
    }
}