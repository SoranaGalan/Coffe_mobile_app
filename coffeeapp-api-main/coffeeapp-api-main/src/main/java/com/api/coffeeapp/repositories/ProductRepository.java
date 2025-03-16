package com.api.coffeeapp.repositories;

import org.springframework.data.repository.CrudRepository;

import com.api.coffeeapp.models.Product;

public interface ProductRepository extends CrudRepository<Product, Long> {

}
