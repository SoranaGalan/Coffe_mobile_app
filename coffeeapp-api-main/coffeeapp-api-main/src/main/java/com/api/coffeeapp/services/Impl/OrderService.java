package com.api.coffeeapp.services.Impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.api.coffeeapp.models.CartProduct;
import com.api.coffeeapp.models.Order;
import com.api.coffeeapp.models.OrderProduct;
import com.api.coffeeapp.models.Price;
import com.api.coffeeapp.repositories.CartProductRepository;
import com.api.coffeeapp.repositories.OrderProductRepository;
import com.api.coffeeapp.repositories.OrderRepository;
import com.api.coffeeapp.services.IOrderService;

@Service
public class OrderService implements IOrderService {

    private final OrderRepository orderRepository;
    private final OrderProductRepository orderProductRepository;
    private final CartProductRepository cartProductRepository;

    public OrderService(OrderRepository orderRepository, OrderProductRepository orderProductRepository, CartProductRepository cartProductRepository) {
        this.orderRepository = orderRepository;
        this.orderProductRepository = orderProductRepository;
        this.cartProductRepository = cartProductRepository;
    }

    @Override
    @Transactional
    public List<Order> getAllUserOrder(String userUid) {
        return orderRepository.findAllByUserUid(userUid);
    }

    @Override
    @Transactional
    public Order addOrder(String userUid) {
        float totalPrice = 0;
        Order newOrder = new Order();
        List<OrderProduct> newOrderProducts = new ArrayList<>();

        List<CartProduct> cartProducts = cartProductRepository.findAllByUserUid(userUid);

        for (CartProduct product : cartProducts) {
            OrderProduct newOrderProduct = new OrderProduct();

            newOrderProduct.size = product.size;
            newOrderProduct.quantity = product.quantity;
            newOrderProduct.product = product.product;

            newOrderProducts.add(newOrderProduct);

            Price price = newOrderProduct.product.prices
                    .stream()
                    .filter(x -> x.size.equals(product.size))
                    .findFirst()
                    .orElse(null);

            totalPrice += price.price * product.quantity;
        }

        newOrder.orderDate = new Date();
        newOrder.totalPrice = totalPrice;
        newOrder.userUid = userUid;

        Order orderAdded = orderRepository.save(newOrder);

        orderProductRepository.saveAll(newOrderProducts.stream().map(x -> {
            x.order = orderAdded;

            return x;
        }).collect(Collectors.toList()));

        cartProductRepository.deleteAll();

        return orderAdded;
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        Order orderToDelete = orderRepository.findById(id).orElseThrow();

        orderRepository.delete(orderToDelete);
    }

}
