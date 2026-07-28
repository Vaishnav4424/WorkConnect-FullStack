package com.workconnect.specification;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import com.workconnect.entities.JobCategory;
import com.workconnect.entities.JobPost;

public class JobPostSpecification {

    public static Specification<JobPost> hasKeyword(String keyword) {

        return (root, query, cb) -> cb.or(

                cb.like(
                        cb.lower(root.get("jobTitle")),
                        "%" + keyword.toLowerCase() + "%"
                ),

                cb.like(
                        cb.lower(root.get("employerProfile")
                                .get("organizationName")),
                        "%" + keyword.toLowerCase() + "%"
                )
        );
    }

    public static Specification<JobPost> hasLocation(String location) {

        return (root, query, cb) ->
                cb.like(
                        cb.lower(root.get("location")),
                        "%" + location.toLowerCase() + "%"
                );
    }

    public static Specification<JobPost> hasCategory(JobCategory category) {

        return (root, query, cb) ->
                cb.equal(root.get("category"), category);
    }

    public static Specification<JobPost> minBudget(BigDecimal budget) {

        return (root, query, cb) ->
                cb.greaterThanOrEqualTo(
                        root.get("budget"),
                        budget
                );
    }

    public static Specification<JobPost> maxBudget(BigDecimal budget) {

        return (root, query, cb) ->
                cb.lessThanOrEqualTo(
                        root.get("budget"),
                        budget
                );
    }
}