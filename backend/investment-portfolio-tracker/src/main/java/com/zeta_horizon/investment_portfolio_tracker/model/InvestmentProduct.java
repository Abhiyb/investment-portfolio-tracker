package com.zeta_horizon.investment_portfolio_tracker.model;

import com.zeta_horizon.investment_portfolio_tracker.enums.InvestmentType;
import com.zeta_horizon.investment_portfolio_tracker.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "investment_products")
public class InvestmentProduct {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvestmentType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RiskLevel riskLevel;

    @Column(name = "minInvestment", nullable = false, precision = 12, scale = 2)
    private BigDecimal minimumInvestment;

    @Column(name = "expectedReturnRate", nullable = false, precision = 5, scale = 2)
    private BigDecimal expectedAnnualReturnRate;

    @Column(name = "currentNAV", nullable = false, precision = 10, scale = 2)
    private BigDecimal currentNetAssetValuePerUnit;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private boolean isActive = true;

    // Add tracking fields
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}
