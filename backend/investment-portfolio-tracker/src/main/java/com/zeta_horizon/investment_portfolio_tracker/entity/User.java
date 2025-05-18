package com.zeta_horizon.investment_portfolio_tracker.entity;

import com.zeta_horizon.investment_portfolio_tracker.enums.UserRole;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.util.UUID;

public class User {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false,unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = false, updatable = false)
    private Timestamp createdAt;
}
