package com.workconnect.entities;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "job_application", uniqueConstraints = {@UniqueConstraint(columnNames = {"job_id", "worker_id"})})

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@ToString(exclude = {"jobPost", "workerProfile"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "application_id")
    private Long applicationId;

    @NotBlank
    @Lob
    @Column(name = "proposal")
    private String proposal;

    @Column(name = "applied_date", nullable = false, updatable = false)
    private LocalDate appliedDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_status", nullable = false)
    private ApplicationStatus applicationStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "worker_id", nullable = false)
    private WorkerProfile workerProfile;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private JobPost jobPost;

    @PrePersist
    public void prePersist() {
        appliedDate = LocalDate.now();

        if (applicationStatus == null) {
            applicationStatus = ApplicationStatus.PENDING;
        }
    }
}
