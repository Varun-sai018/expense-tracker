package com.example.demo.expensetracker.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.expensetracker.model.Transaction;
import com.example.demo.expensetracker.model.Wallet;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByWallet(Wallet wallet);
    List<Transaction> findByWalletAndDateBetween(Wallet wallet, LocalDate start, LocalDate end);
}