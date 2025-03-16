package com.api.coffeeapp.services;

import org.springframework.stereotype.Component;

import com.api.coffeeapp.models.CreditCard;

@Component
public interface ICreditCardService {

    CreditCard getUserCredCard(String token) throws Exception;

    void saveCreditCard(CreditCard newCreditCard, String token) throws Exception;
}
