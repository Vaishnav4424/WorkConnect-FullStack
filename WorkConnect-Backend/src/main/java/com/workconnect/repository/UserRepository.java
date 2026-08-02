package com.workconnect.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workconnect.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

}
