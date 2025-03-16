package com.api.coffeeapp.services.Impl;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.api.coffeeapp.models.Price;
import com.api.coffeeapp.models.Product;
import com.api.coffeeapp.repositories.PriceRepository;
import com.api.coffeeapp.repositories.ProductRepository;
import com.api.coffeeapp.services.IPriceService;

@Service
public class PriceService implements IPriceService {

    private final ProductRepository productRepository;
    private final PriceRepository priceRepository;

    public PriceService(ProductRepository productRepository, PriceRepository priceRepository) {
        this.productRepository = productRepository;
        this.priceRepository = priceRepository;
    }

    @Override
    @Transactional
    public Price addPrice(Long productId, Price newPrice) {

        Product product = productRepository.findById(productId).orElseThrow();

        newPrice.product = product;

        Price priceAdded = priceRepository.save(newPrice);

        return priceAdded;
    }

    @Override
    @Transactional
    public Price updatePrice(Long id, Price updatedPrice) {
        Price price = priceRepository.findById(id).orElseThrow();

        if (updatedPrice.size != null) {
            price.size = updatedPrice.size;
        }

        if (updatedPrice.currency != null) {
            price.currency = updatedPrice.currency;
        }

        if (updatedPrice.size != null) {
            price.size = updatedPrice.size;
        }

        Price priceUpdated = priceRepository.save(price);

        return priceUpdated;
    }
}
