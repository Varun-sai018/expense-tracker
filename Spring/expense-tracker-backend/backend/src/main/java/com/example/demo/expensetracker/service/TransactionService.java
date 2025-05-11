package com.example.demo.expensetracker.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.expensetracker.model.Transaction;
import com.example.demo.expensetracker.model.Wallet;
import com.example.demo.expensetracker.repository.TransactionRepository;

@Service
public class TransactionService {
    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transaction> getTransactionsByWallet(Wallet wallet) {
        return transactionRepository.findByWallet(wallet);
    }

    public List<Transaction> getTransactionsByWalletAndDateRange(Wallet wallet, LocalDate start, LocalDate end) {
        return transactionRepository.findByWalletAndDateBetween(wallet, start, end);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id).orElseThrow(() -> new RuntimeException("Transaction not found"));
    }
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}