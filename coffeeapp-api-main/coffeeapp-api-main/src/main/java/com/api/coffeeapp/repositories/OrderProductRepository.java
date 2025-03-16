package com.api.coffeeapp.repositories;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.api.coffeeapp.models.Order;
import com.api.coffeeapp.models.OrderProduct;

public interface OrderProductRepository extends CrudRepository<OrderProduct, Long> {

    List<OrderProduct> findAllByOrder(Order order);

}
