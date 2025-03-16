package com.api.coffeeapp.services;

import org.springframework.stereotype.Component;

import com.api.coffeeapp.models.Price;

@Component
public interface IPriceService {

    Price addPrice(Long productId, Price newPrice);

    Price updatePrice(Long id, Price updatedPrice);
}
