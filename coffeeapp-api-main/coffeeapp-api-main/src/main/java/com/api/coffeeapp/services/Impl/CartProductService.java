package com.api.coffeeapp.services.Impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.api.coffeeapp.models.CartProduct;
import com.api.coffeeapp.models.Product;
import com.api.coffeeapp.repositories.CartProductRepository;
import com.api.coffeeapp.repositories.ProductRepository;
import com.api.coffeeapp.services.ICartProductService;

@Service
public class CartProductService implements ICartProductService {

    private final CartProductRepository cartProductRepository;
    private final ProductRepository productRepository;

    public CartProductService(CartProductRepository cartProductRepository, ProductRepository productRepository) {
        this.cartProductRepository = cartProductRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public List<CartProduct> getUserCartProducts(String userUid) {
        return cartProductRepository.findAllByUserUid(userUid);
    }

    @Override
    @Transactional
    public CartProduct addCartProduct(Long productId, String userUid, String size) {
        CartProduct newCartProduct = new CartProduct();

        Product product = productRepository.findById(productId).orElseThrow();

        newCartProduct.product = product;
        newCartProduct.userUid = userUid;
        newCartProduct.quantity = 1;
        newCartProduct.size = size;

        return cartProductRepository.save(newCartProduct);

    }

    @Override
    @Transactional
    public CartProduct updateCartProduct(Long id, Integer newQuantity) {
        CartProduct cartProductToUpdate = cartProductRepository.findById(id).orElseThrow();

        if (newQuantity != null) {
            cartProductToUpdate.quantity = newQuantity;

        }

        return cartProductRepository.save(cartProductToUpdate);
    }

    @Override
    @Transactional
    public void deleteCartProduct(Long id) {
        CartProduct cartProductToDelete = cartProductRepository.findById(id).orElseThrow();

        cartProductRepository.delete(cartProductToDelete);
    }

}
