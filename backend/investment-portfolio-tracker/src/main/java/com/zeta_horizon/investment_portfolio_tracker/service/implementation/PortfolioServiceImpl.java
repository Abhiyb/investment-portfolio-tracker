package com.zeta_horizon.investment_portfolio_tracker.service.implementation;

import com.zeta_horizon.investment_portfolio_tracker.dto.*;
import com.zeta_horizon.investment_portfolio_tracker.entity.InvestmentProduct;
import com.zeta_horizon.investment_portfolio_tracker.entity.Portfolio;
import com.zeta_horizon.investment_portfolio_tracker.entity.Transaction;
import com.zeta_horizon.investment_portfolio_tracker.entity.User;
import com.zeta_horizon.investment_portfolio_tracker.enums.TransactionType;
import com.zeta_horizon.investment_portfolio_tracker.exception.InsufficientUnitsException;
import com.zeta_horizon.investment_portfolio_tracker.exception.InvalidInvestmentException;
import com.zeta_horizon.investment_portfolio_tracker.exception.MinimumInvestmentException;
import com.zeta_horizon.investment_portfolio_tracker.repository.InvestmentProductRepository;
import com.zeta_horizon.investment_portfolio_tracker.repository.PortfolioRepository;
import com.zeta_horizon.investment_portfolio_tracker.repository.TransactionRepository;
import com.zeta_horizon.investment_portfolio_tracker.service.PortfolioService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
public class PortfolioServiceImpl implements PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final InvestmentProductRepository investmentProductRepository;
    private final TransactionRepository transactionRepository;

    public PortfolioServiceImpl(PortfolioRepository portfolioRepository,
                                InvestmentProductRepository investmentProductRepository,
                                TransactionRepository transactionRepository) {
        this.portfolioRepository = portfolioRepository;
        this.investmentProductRepository = investmentProductRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    public PortfolioResponseDto getUserPortfolio(User user) {
        List<Portfolio> portfolios = portfolioRepository.findByUser(user);

        List<PortfolioItemDto> holdings = portfolios.stream()
                .map(this :: mapToPortfolioItemDto)
                .toList();
        BigDecimal totalInvestedValue = holdings.stream()
                .map(PortfolioItemDto::getInvestedValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCurrentValue = holdings.stream()
                .map(PortfolioItemDto::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return PortfolioResponseDto.builder()
                .holdings(holdings)
                .totalInvestedValue(totalInvestedValue)
                .totalCurrentValue(totalCurrentValue)
                .build();
    }

    @Transactional
    @Override
    public PortfolioItemDto buyInvestment(User user, BuyInvestmentRequestDto request) {
        InvestmentProduct product = investmentProductRepository.findById(request.getInvestmentProductId())
                .orElseThrow(() -> new InvalidInvestmentException("Investment product not found"));
        if (!product.isActive()) {
            throw new InvalidInvestmentException("Investment product is not active");
        }

        BigDecimal investmentAmount  = request.getUnits().multiply(product.getCurrentNetAssetValuePerUnit());

        if(investmentAmount.compareTo(product.getMinimumInvestment()) < 0){
            throw new MinimumInvestmentException("Minimum investment required: " + product.getMinimumInvestment());
        }

        // Find or create portfolio entry
        Portfolio portfolio = portfolioRepository.findByUserAndInvestmentProduct(user, product)
                .orElse(new Portfolio(null, user, product, BigDecimal.ZERO, BigDecimal.ZERO));

        // Update average purchase price
        if (portfolio.getUnitsOwned().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal totalOldValue = portfolio.getUnitsOwned().multiply(portfolio.getAvgPurchasePrice());
            BigDecimal totalNewValue = request.getUnits().multiply(product.getCurrentNetAssetValuePerUnit());
            BigDecimal totalUnits = portfolio.getUnitsOwned().add(request.getUnits());

            BigDecimal newAvgPrice = totalOldValue.add(totalNewValue).divide(totalUnits, 2, RoundingMode.HALF_UP);
            portfolio.setAvgPurchasePrice(newAvgPrice);
        } else {
            portfolio.setAvgPurchasePrice(product.getCurrentNetAssetValuePerUnit());
        }

        // set units in portfolio
        portfolio.setUnitsOwned(portfolio.getUnitsOwned().add(request.getUnits()));

        //save the portfolio
        Portfolio savedPortfolio = portfolioRepository.save(portfolio);

        // reduce units in investmentProduct

        // Record transaction
        Transaction transaction = Transaction.builder()
                .user(user)
                .txnType(TransactionType.BUY)
                .investmentProduct(product)
                .units(request.getUnits())
                .navAtTxn(product.getCurrentNetAssetValuePerUnit())
                .txnDate(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);

        return mapToPortfolioItemDto(savedPortfolio);
    }

    @Override
    @Transactional
    public PortfolioItemDto sellInvestment(User user, SellInvestmentRequestDto request) {
        InvestmentProduct product = investmentProductRepository.findById(request.getInvestmentProductId())
                .orElseThrow(() -> new InvalidInvestmentException("Investment product not found"));

        Portfolio portfolio = portfolioRepository.findByUserAndInvestmentProduct(user, product)
                .orElseThrow(() -> new InvalidInvestmentException("You don't have this investment in your portfolio"));

        // Check if user has enough units
        if (portfolio.getUnitsOwned().compareTo(request.getUnits()) < 0) {
            throw new InsufficientUnitsException("Not enough units to sell. Available: " + portfolio.getUnitsOwned());
        }

        // Subtract units
        portfolio.setUnitsOwned(portfolio.getUnitsOwned().subtract(request.getUnits()));

        // if units is 0 then delete that investment
        if (portfolio.getUnitsOwned().compareTo(BigDecimal.ZERO) == 0) {
            log.info("deleting item");
            portfolioRepository.deleteById(portfolio.getId());
        }
        else {
            // Average purchase price remains the same for simplicity
            // Save portfolio
            Portfolio savedPortfolio = portfolioRepository.save(portfolio);
        }

        Transaction transaction = Transaction.builder()
                .user(user)
                .investmentProduct(product)
                .txnType(TransactionType.SELL)
                .units(request.getUnits())
                .navAtTxn(product.getCurrentNetAssetValuePerUnit())
                .txnDate(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);
        return mapToPortfolioItemDto(portfolio);
    }

    @Override
    public TransactionHistoryResponseDto getTransactionHistory(User user) {
        List<Transaction> transactions = transactionRepository.findByUserOrderByTxnDateDesc(user);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        List<TransactionDto> transactionDTOs = transactions.stream()
                .map(txn -> TransactionDto.builder()
                        .id(txn.getId())
                        .investmentProductName(txn.getInvestmentProduct().getName())
                        .txnType(txn.getTxnType().toString())
                        .units(txn.getUnits())
                        .navAtTxn(txn.getNavAtTxn())
                        .amount(txn.getUnits().multiply(txn.getNavAtTxn()))
                        .txnDate(txn.getTxnDate().format(formatter))
                        .build())
                .toList();
        return TransactionHistoryResponseDto.builder()
                .transactions(transactionDTOs)
                .build();
    }

    @Override
    public PortfolioItemDto getInvestmentById(User user, Integer id) {

        Portfolio product = portfolioRepository.findById(id).get();

        return mapToPortfolioItemDto(product);
    }


    private PortfolioItemDto mapToPortfolioItemDto(Portfolio portfolio){
        InvestmentProduct product = portfolio.getInvestmentProduct();
        BigDecimal investedValue = portfolio.getUnitsOwned().multiply(portfolio.getAvgPurchasePrice()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal currentValue = portfolio.getUnitsOwned().multiply(product.getCurrentNetAssetValuePerUnit()).setScale(2,RoundingMode.HALF_UP);
        BigDecimal absoluteReturn = currentValue.subtract(investedValue);
        BigDecimal percentageReturn = investedValue.compareTo(BigDecimal.ZERO) > 0
                ? absoluteReturn.multiply(new BigDecimal("100")).divide(investedValue, 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        return PortfolioItemDto.builder()
                .id(portfolio.getId())
                .investmentProductId(product.getId())
                .investmentProductName(product.getName())
                .type(product.getType().toString())
                .riskLevel(product.getRiskLevel().toString())
                .unitsOwned(portfolio.getUnitsOwned())
                .avgPurchasePrice(portfolio.getAvgPurchasePrice())
                .currentNAV(product.getCurrentNetAssetValuePerUnit())
                .investedValue(investedValue)
                .currentValue(currentValue)
                .absoluteReturn(absoluteReturn)
                .percentageReturn(percentageReturn)
                .build();
    }
}