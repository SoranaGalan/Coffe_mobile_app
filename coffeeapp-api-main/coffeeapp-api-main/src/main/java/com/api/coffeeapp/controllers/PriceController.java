package com.api.coffeeapp.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.coffeeapp.models.Price;
import com.api.coffeeapp.services.IPriceService;

@RestController
@CrossOrigin
@RequestMapping("/api/prices")
public class PriceController {

    private final IPriceService priceService;

    public PriceController(IPriceService priceService) {
        this.priceService = priceService;
    }

    @PostMapping("/{productId}")
    public ResponseEntity addPrice(@PathVariable(value = "productId") Long productId, @RequestBody Price newPrice) {

        return ResponseEntity.ok().body(priceService.addPrice(productId, newPrice));

    }

    @PutMapping("/{id}")
    public ResponseEntity updatePrice(@PathVariable(value = "id") Long id, @RequestBody Price updatedPrice) {
        return ResponseEntity.ok().body(priceService.updatePrice(id, updatedPrice));
    }
}
