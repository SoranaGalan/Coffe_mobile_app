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
@Table(name = "Prices")
public class Price {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Schema(hidden = true)
    public Long id;

    @Column(length = 100)
    public String size;

    public Float price;

    @Column(length = 100)
    public String currency;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    public Product product;
}
