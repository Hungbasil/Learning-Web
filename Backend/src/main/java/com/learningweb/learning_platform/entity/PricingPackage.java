package com.learningweb.learning_platform.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pricing_packages")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class PricingPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String packageName;
    private Long amount;
    private Integer tokens;     

    private Boolean active = true;
}
