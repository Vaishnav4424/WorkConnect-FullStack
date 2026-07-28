package com.workconnect.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "job_post")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@ToString(exclude = {"employerProfile", "applications"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class JobPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "job_id")
    private Long jobId;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "job_title", length = 50, nullable = false)
    private String jobTitle;

    @Lob
    @Column(name = "job_description")
    private String jobDescription;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobCategory category;

    @NotBlank
    @Column(length = 150, nullable = false)
    private String location;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal budget;

    @NotNull
    @Column(nullable = false)
    private LocalDate deadline;

    @Column(name = "posted_date", nullable = false, updatable = false)
    private LocalDate postedDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employer_id", nullable = false)
    private EmployerProfile employerProfile;

    @OneToMany(mappedBy = "jobPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobApplication> applications = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        postedDate = LocalDate.now();

        if (status == null) {
            status = JobStatus.OPEN;
        }
    }
}