package com.example.demo.expensetracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.expensetracker.model.User;
import com.example.demo.expensetracker.model.Wallet;
import com.example.demo.expensetracker.repository.WalletRepository;


@Service
public class WalletService {
    @Autowired
    private WalletRepository walletRepository;

    public List<Wallet> getWalletsByUser(User user) {
        return walletRepository.findByUser(user);
    }

    public Wallet saveWallet(Wallet wallet) {
        return walletRepository.save(wallet);
    }
    public Wallet getWalletById(Long id) {
        return walletRepository.findById(id).orElseThrow(() -> new RuntimeException("Wallet not found"));
    }
    public void deleteWallet(Long id) {
        walletRepository.deleteById(id);
    }
}