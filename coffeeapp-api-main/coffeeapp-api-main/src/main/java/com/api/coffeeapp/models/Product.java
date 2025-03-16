package com.api.coffeeapp.models;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.api.coffeeapp.core.enums.ProductType;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "Products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Schema(hidden = true)
    public Long id;

    @Column(length = 100)
    public String name;

    @Lob
    @Column(length = 1000)
    public String description;

    @Column(length = 100)
    public String roasted;

    @Lob
    @Column(length = 1000)
    public String imagelink_square;

    @Lob
    @Column(length = 1000)
    public String imagelink_portrait;

    @Column(length = 100)
    public String ingredients;

    @Column(length = 100)
    public String special_ingredient;

    @Enumerated(EnumType.STRING)
    public ProductType productType;

    @Schema(hidden = true)
    @OneToMany(targetEntity = Price.class, mappedBy = "product", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    public List<Price> prices = new ArrayList<>();
}
