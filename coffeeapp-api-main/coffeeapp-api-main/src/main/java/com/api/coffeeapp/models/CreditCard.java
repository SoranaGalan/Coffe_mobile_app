package com.api.coffeeapp.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "CreditCards")
public class CreditCard {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Schema(hidden = true)
    public Long id;

    @Column(length = 100)
    public String lastDigits;

    @Column(length = 100)
    public String expiryDate;

    @Column(length = 100)
    public String holderName;

    @Column(length = 100)
    public String userUid;

    @Column(length = 100)
    public String saltValue;

    public CreditCard() {
    }
}
