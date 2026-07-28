package com.workconnect.entities;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Table(name = "review")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@ToString(exclude = "contract")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "review_id")
    private Long reviewId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false, unique = true)
    private Contract contract;

    @Min(1)
    @Max(5)
    @Column(nullable = false)
    private int rating;

    @Lob
    @Column(name = "comment")
    private String comment;

    @Column(name = "review_date", nullable = false, updatable = false)
    private LocalDate reviewDate;

    @PrePersist
    public void prePersist() {
        reviewDate = LocalDate.now();
    }
}
