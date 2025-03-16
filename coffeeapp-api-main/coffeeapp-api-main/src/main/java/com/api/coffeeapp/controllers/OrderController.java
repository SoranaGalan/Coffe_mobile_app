package com.api.coffeeapp.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.coffeeapp.services.IOrderService;

@RestController
@CrossOrigin
@RequestMapping("/api/orders")
public class OrderController {

    private final IOrderService orderService;

    public OrderController(IOrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/{userUid}")
    public ResponseEntity getAllUserOrder(@PathVariable(value = "userUid") String userUid) {

        return ResponseEntity.ok().body(orderService.getAllUserOrder(userUid));
    }

    @PostMapping("/{userUid}")
    public ResponseEntity addOrder(@PathVariable(value = "userUid") String userUid) {

        return ResponseEntity.ok().body(orderService.addOrder(userUid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteOrder(@PathVariable(value = "id") Long id) {
        orderService.deleteOrder(id);

        return ResponseEntity.ok().build();
    }
}
