package com.api.coffeeapp.services;

import java.util.List;

import org.springframework.stereotype.Component;

import com.api.coffeeapp.models.CartProduct;

@Component
public interface ICartProductService {

    List<CartProduct> getUserCartProducts(String userUid);

    CartProduct addCartProduct(Long productId, String userUid, String size);

    CartProduct updateCartProduct(Long id, Integer newQuantity);

    void deleteCartProduct(Long id);
}
