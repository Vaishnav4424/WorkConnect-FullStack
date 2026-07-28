package com.workconnect.entities;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "employer_profile")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@ToString(exclude = {"user", "jobPosts"})

public class EmployerProfile {

    @Id
    @Column(name = "user_id")
    private Long employerId;

    @NotBlank
    @Size(max = 100)
    @Column(name = "organization_name", nullable = false, length = 100)
    private String organizationName;

    @Lob
    @Column(name = "organization_description")
    private String organizationDescription;

    @NotBlank
    @Size(max = 255)
    @Column(name = "organization_address", nullable = false)
    private String organizationAddress;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String city;

    @NotBlank
    @Size(max = 50)
    @Column(nullable = false, length = 50)
    private String state;

    @NotBlank
    @Pattern(regexp = "\\d{6}")
    @Column(nullable = false, length = 6)
    private String pincode;

    @Size(max = 15)
    @Column(name = "gst_number", unique = true, length = 15)
    private String gstNumber;

    @NotBlank
    @Size(max = 100)
    @Column(name = "contact_person", nullable = false, length = 100)
    private String contactPerson;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = Boolean.FALSE;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @OneToMany(mappedBy = "employerProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<JobPost> jobPosts = new ArrayList<>();
}