package com.workconnect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workconnect.entities.Review;

public interface ReviewRepository extends JpaRepository<Review , Long>{

}
