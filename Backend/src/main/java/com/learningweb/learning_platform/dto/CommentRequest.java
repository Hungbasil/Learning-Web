package com.learningweb.learning_platform.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CommentRequest {
    private String content;
    private Long parentId;
}
