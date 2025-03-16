package com.api.coffeeapp.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.api.coffeeapp.models.Order;

public interface OrderRepository extends CrudRepository<Order, Long> {

    List<Order> findAllByUserUid(String userUid);
}
