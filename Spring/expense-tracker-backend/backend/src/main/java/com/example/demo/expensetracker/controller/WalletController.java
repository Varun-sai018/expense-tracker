package com.example.demo.expensetracker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.example.demo.expensetracker.model.Wallet;
import com.example.demo.expensetracker.service.UserService;
import com.example.demo.expensetracker.service.WalletService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/wallets")
@CrossOrigin(origins = "http://localhost:5174")
public class WalletController {
    @Autowired
    private WalletService walletService;

    @Autowired
    private UserService userService;

    @GetMapping("/by-user")
    public List<Wallet> getWalletsByUser(@RequestParam String email) {
        return userService.findByEmail(email)
                .map(walletService::getWalletsByUser)
                .orElse(List.of());
    }

    @PostMapping
    public ResponseEntity<?> addWallet(@Valid @RequestBody Wallet wallet, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().get(0).getDefaultMessage());
        }
        return ResponseEntity.ok(walletService.saveWallet(wallet));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateWallet(@PathVariable Long id, @Valid @RequestBody Wallet walletDetails, BindingResult result) {
        if (result.hasErrors()) {
            return ResponseEntity.badRequest().body(result.getAllErrors().get(0).getDefaultMessage());
        }
        Wallet wallet = walletService.getWalletById(id);
        wallet.setName(walletDetails.getName());
        wallet.setType(walletDetails.getType());
        wallet.setBalance(walletDetails.getBalance());
        // update other fields as needed
        return ResponseEntity.ok(walletService.saveWallet(wallet));
    }

    @DeleteMapping("/{id}")
    public void deleteWallet(@PathVariable Long id) {
        walletService.deleteWallet(id);
    }
}