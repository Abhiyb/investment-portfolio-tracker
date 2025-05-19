package com.zeta_horizon.investment_portfolio_tracker.service;

import com.zeta_horizon.investment_portfolio_tracker.entity.User;
import org.springframework.security.core.userdetails.UserDetails;

public interface JWTService {
    public String generateToken(User user);

    String extractUsername(String token);

    boolean validateToken(String token, UserDetails userDetails);
}
