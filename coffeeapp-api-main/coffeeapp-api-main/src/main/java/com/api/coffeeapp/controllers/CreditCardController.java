package com.api.coffeeapp.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.coffeeapp.models.CreditCard;
import com.api.coffeeapp.services.ICreditCardService;

@RestController
@CrossOrigin
@RequestMapping("/api/card")
public class CreditCardController {

    private final ICreditCardService creditCardService;

    public CreditCardController(ICreditCardService creditCardService) {
        this.creditCardService = creditCardService;
    }

    @GetMapping("")
    public ResponseEntity getUserCredCard(@RequestHeader("Authorization") String authorizationHeader) throws Exception {
        String token = authorizationHeader.substring(7);

        return ResponseEntity.ok().body(creditCardService.getUserCredCard(token));
    }

    @PostMapping("")
    public ResponseEntity saveCreditCard(@RequestBody CreditCard creditCard, @RequestHeader("Authorization") String authorizationHeader) throws Exception {
        String token = authorizationHeader.substring(7);

        creditCardService.saveCreditCard(creditCard, token);

        return ResponseEntity.ok().build();
    }
}
