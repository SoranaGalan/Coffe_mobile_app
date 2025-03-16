package com.api.coffeeapp.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.api.coffeeapp.models.CartProduct;

public interface CartProductRepository extends CrudRepository<CartProduct, Long> {

    List<CartProduct> findAllByUserUid(String userUid);
}
