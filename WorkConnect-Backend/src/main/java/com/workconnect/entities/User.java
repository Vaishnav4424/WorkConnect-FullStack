package com.workconnect.entities;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "users")

@Getter
@Setter

@NoArgsConstructor
@AllArgsConstructor

@ToString(exclude = {"password"})

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @Column(name = "user_id")
    private Long userId;

    @NotBlank
    @Size(max = 30)
    @Column(name = "first_name", length = 30, nullable = false)
    private String firstName;

    @NotBlank
    @Size(max = 30)
    @Column(name = "last_name", length = 30, nullable = false)
    private String lastName;

    @NotBlank
    @Email
    @Column(length = 60, unique = true, nullable = false)
    private String email;

    @NotBlank
    @Column(length = 100, nullable = false)
    private String password;

    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$")
    @Column(name = "phone_number", length = 14, unique = true, nullable = false)
    private String phoneNumber;

    @Column(length = 255)
    private String address;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(name = "registration_date", nullable = false, updatable = false)
    private LocalDate registrationDate;

    //@OneToOne(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    //private WorkerProfile workerProfile;

    @PrePersist
    public void prePersist() {
        registrationDate = LocalDate.now();
    }
}
