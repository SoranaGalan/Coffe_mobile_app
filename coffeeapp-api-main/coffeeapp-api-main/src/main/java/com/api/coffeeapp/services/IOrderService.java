package com.api.coffeeapp.services;

import java.util.List;

import org.springframework.stereotype.Component;

import com.api.coffeeapp.models.Order;

@Component
public interface IOrderService {

    List<Order> getAllUserOrder(String userUid);

    Order addOrder(String userUid);

    void deleteOrder(Long id);
}
