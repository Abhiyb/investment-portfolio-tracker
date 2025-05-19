package com.zeta_horizon.investment_portfolio_tracker.service;

import com.zeta_horizon.investment_portfolio_tracker.entity.User;

public interface JWTService {
    public String generateToken(User user);
}
