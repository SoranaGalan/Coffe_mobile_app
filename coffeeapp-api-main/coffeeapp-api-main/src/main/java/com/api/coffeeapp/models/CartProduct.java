package com.api.coffeeapp.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "CartProducts")
public class CartProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Schema(hidden = true)
    public Long id;

    public Integer quantity;

    @Column(length = 100)
    public String size;

    @Column(length = 100)
    public String userUid;

    @ManyToOne
    @JoinColumn(name = "product_id")
    public Product product;

    public CartProduct() {
    }
}
