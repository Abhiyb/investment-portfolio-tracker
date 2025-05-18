package com.zeta_horizon.investment_portfolio_tracker.repository;

import com.zeta_horizon.investment_portfolio_tracker.model.InvestmentProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvestmentProductRepository extends JpaRepository<InvestmentProduct, Long> {
}
