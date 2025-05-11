package com.example.demo.expensetracker.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.example.demo.expensetracker.model.Transaction;
import com.example.demo.expensetracker.model.Wallet;
import com.example.demo.expensetracker.repository.WalletRepository;
import com.example.demo.expensetracker.service.TransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:5174")
public class TransactionController {
    @Autowired
    private TransactionService transactionService;

    @Autowired
    private WalletRepository walletRepository;

    @GetMapping("/by-wallet")
    public List<Transaction> getTransactionsByWallet(@RequestParam Long walletId) {
        Wallet wallet = walletRepository.findById(walletId).orElse(null);
        if (wallet == null) return List.of();
        return transactionService.getTransactionsByWallet(wallet);
    }

    @GetMapping("/by-wallet-and-date")
    public List<Transaction> getTransactionsByWalletAndDate(
            @RequestParam Long walletId,
            @RequestParam String start,
            @RequestParam String end
    ) {
        Wallet wallet = walletRepository.findById(walletId).orElse(null);
        if (wallet == null) return List.of();
        LocalDate startDate = LocalDate.parse(start);
        LocalDate endDate = LocalDate.parse(end);
        return transactionService.getTransactionsByWalletAndDateRange(wallet, startDate, endDate);
    }

    @PostMapping
    public ResponseEntity<?> addTransaction(@Valid @RequestBody Transaction transaction, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().get(0).getDefaultMessage());
        }
        return ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id, @Valid @RequestBody Transaction transactionDetails, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().get(0).getDefaultMessage());
        }
        Transaction transaction = transactionService.getTransactionById(id);
        transaction.setAmount(transactionDetails.getAmount());
        transaction.setDescription(transactionDetails.getDescription());
        transaction.setCategory(transactionDetails.getCategory());
        transaction.setDate(transactionDetails.getDate());
        transaction.setType(transactionDetails.getType());
        // update wallet if needed
        return ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    @DeleteMapping("/{id}")
    public void deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
    }
}