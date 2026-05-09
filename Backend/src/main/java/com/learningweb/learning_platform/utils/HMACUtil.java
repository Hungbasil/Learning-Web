package com.learningweb.learning_platform.utils;


import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class HMACUtil {

    public static final String HMAC_SHA256 = "HmacSHA256";

    public static String HMacHexStringEncode(String algorithm, String key, String data) {
        try {
            Mac mac = Mac.getInstance(algorithm);
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(), algorithm);
            mac.init(secretKey);
            byte[] digest = mac.doFinal(data.getBytes());
            StringBuilder sb = new StringBuilder(digest.length * 2);
            for (byte b : digest) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception e) {
            System.out.println("Lỗi tạo chữ ký MAC: " + e.getMessage());
            return null;
        }
    }
}
