package com.api.coffeeapp.repositories;

import org.springframework.data.repository.CrudRepository;

import com.api.coffeeapp.models.CreditCard;

public interface CreditCardRepository extends CrudRepository<CreditCard, Long> {

    CreditCard findFirstByUserUid(String userUid);
}
