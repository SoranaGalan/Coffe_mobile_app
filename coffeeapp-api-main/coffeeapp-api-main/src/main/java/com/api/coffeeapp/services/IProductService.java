package com.api.coffeeapp.services;

import java.util.List;

import org.springframework.stereotype.Component;

import com.api.coffeeapp.models.Product;

@Component
public interface IProductService {

    List<Product> getAllProducts();

    Product addProduct(Product newProduct);

    Product updateProduct(Long id, Product updatedProduct);

    void deleteProduct(Long id);
}
