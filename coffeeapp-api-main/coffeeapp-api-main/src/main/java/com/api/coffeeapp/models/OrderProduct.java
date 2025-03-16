package com.api.coffeeapp.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "OrderProducts")
public class OrderProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Schema(hidden = true)
    public Long id;

    @Column(length = 100)
    public String size;

    public Integer quantity;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @Schema(hidden = true)
    public Product product;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore
    @Schema(hidden = true)
    public Order order;

    public OrderProduct() {
    }
}
