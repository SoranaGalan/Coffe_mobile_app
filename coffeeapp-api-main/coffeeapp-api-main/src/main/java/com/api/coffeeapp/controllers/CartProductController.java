package com.api.coffeeapp.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.coffeeapp.services.ICartProductService;

@RestController
@CrossOrigin
@RequestMapping("/api/cart")
public class CartProductController {

    private final ICartProductService cartProductService;

    public CartProductController(ICartProductService cartProductService) {
        this.cartProductService = cartProductService;
    }

    @GetMapping("/{userUid}")
    public ResponseEntity getUserCartProducts(@PathVariable(name = "userUid") String userUid) {
        return ResponseEntity.ok().body(cartProductService.getUserCartProducts(userUid));
    }

    @PostMapping("/{productId}/{userUid}/{size}")
    public ResponseEntity addCartProduct(
            @PathVariable(name = "productId") Long productId,
            @PathVariable(name = "userUid") String userUid,
            @PathVariable(name = "size") String size) {
        return ResponseEntity.ok().body(cartProductService.addCartProduct(productId, userUid, size));
    }

    @PutMapping("/{id}/{quantity}")
    public ResponseEntity updateCartProduct(
            @PathVariable(value = "id") Long id,
            @PathVariable(value = "quantity") Integer quantity) {
        return ResponseEntity.ok().body(cartProductService.updateCartProduct(id, quantity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteCartProduct(@PathVariable(value = "id") Long id) {
        cartProductService.deleteCartProduct(id);

        return ResponseEntity.ok().build();
    }
}
