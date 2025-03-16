package com.api.coffeeapp.services.Impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.api.coffeeapp.models.Product;
import com.api.coffeeapp.repositories.ProductRepository;
import com.api.coffeeapp.services.IProductService;

@Service
public class ProductService implements IProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public List<Product> getAllProducts() {
        List<Product> products = new ArrayList<>();

        productRepository.findAll().forEach(x -> products.add(0, x));

        return products;
    }

    @Override
    @Transactional
    public Product addProduct(Product newProduct) {

        Product productAdded = productRepository.save(newProduct);

        return productAdded;
    }

    @Override
    @Transactional
    public Product updateProduct(Long id, Product updatedProduct) {
        Product productToUpdate = productRepository.findById(id).orElseThrow();

        System.out.print(productToUpdate);

        if (updatedProduct.name != null) {
            productToUpdate.name = updatedProduct.name;
        }

        if (updatedProduct.description != null) {
            productToUpdate.description = updatedProduct.description;
        }

        if (updatedProduct.roasted != null) {
            productToUpdate.roasted = updatedProduct.roasted;
        }

        if (updatedProduct.imagelink_square != null) {
            productToUpdate.imagelink_square = updatedProduct.imagelink_square;
        }

        if (updatedProduct.imagelink_portrait != null) {
            productToUpdate.imagelink_portrait = updatedProduct.imagelink_portrait;
        }

        if (updatedProduct.ingredients != null) {
            productToUpdate.ingredients = updatedProduct.ingredients;
        }

        if (updatedProduct.special_ingredient != null) {
            productToUpdate.special_ingredient = updatedProduct.special_ingredient;
        }

        if (updatedProduct.productType != null) {
            productToUpdate.productType = updatedProduct.productType;
        }

        Product productUpdated = productRepository.save(productToUpdate);

        return productUpdated;
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product productToDelete = productRepository.findById(id).orElseThrow();

        productRepository.delete(productToDelete);

    }
}
