package com.api.coffeeapp.repositories;

import org.springframework.data.repository.CrudRepository;

import com.api.coffeeapp.models.Price;

public interface PriceRepository extends CrudRepository<Price, Long> {

}
