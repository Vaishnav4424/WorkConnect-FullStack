package com.workconnect.entities;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@Table(name = "payment")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@ToString(exclude = "contract")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)

public class Payment {

    @Id
    @Column(name = "payment_id")
    @EqualsAndHashCode.Include
    private Long paymentId;

    //@MapsId
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_date", updatable = false)
    private LocalDate paymentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;

    @PrePersist
    public void prePersist() {
        if (paymentDate == null) {
            paymentDate = LocalDate.now();
        }

        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.PENDING;
        }
    }
}
