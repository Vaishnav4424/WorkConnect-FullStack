package com.workconnect.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "contract", uniqueConstraints = {@UniqueConstraint(columnNames = "application_id")})

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@ToString(exclude = {"jobApplication", "payments", "review"})

@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "contract_id")
    private Long contractId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id",nullable = false,unique = true)
    private JobApplication jobApplication;

    @NotNull
    @Column(name = "start_date")
    private LocalDate startDate;

    @NotNull
    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_status", nullable = false)
    private ContractStatus contractStatus;

    @NotNull
    @Column(name = "agreed_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal agreedAmount;

    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();

    @OneToOne(mappedBy = "contract", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Review review;

    @PrePersist
    public void prePersist() {
        if (contractStatus == null) {
            contractStatus = ContractStatus.ACTIVE;
        }
    }
}
