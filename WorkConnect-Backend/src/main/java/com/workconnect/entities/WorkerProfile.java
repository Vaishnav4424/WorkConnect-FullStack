package com.workconnect.entities;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "worker_profile")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@ToString(exclude = {"user", "jobApplications"})

public class WorkerProfile {

    @Id
    @Column(name = "worker_id")
    private Long workerId;

    @NotBlank
    @Column(name = "skill_description", length = 300)
    private String skillDescription;

    @Min(0)
    @Column(name = "experience_years")
    private int experienceYears;

    @PositiveOrZero
    @Column(name = "hourly_rate", precision = 10, scale = 2)
    private BigDecimal hourlyRate;

    @Lob
    @Column(name = "profile_description")
    private String profileDescription;

    @Column(name = "average_rating")
    private double averageRating;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "workerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobApplication> jobApplications = new ArrayList<>();
    
}