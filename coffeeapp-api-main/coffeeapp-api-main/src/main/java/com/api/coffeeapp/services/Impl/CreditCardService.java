package com.api.coffeeapp.services.Impl;

import java.util.Base64;

import javax.transaction.Transactional;

import org.springframework.stereotype.Service;

import com.api.coffeeapp.core.utils.AESUtil;
import com.api.coffeeapp.core.utils.BasedEncryptionUtil;
import com.api.coffeeapp.core.utils.FirebaseTokenUtil;
import com.api.coffeeapp.core.utils.SaltGeneratorUtil;
import com.api.coffeeapp.models.CreditCard;
import com.api.coffeeapp.repositories.CreditCardRepository;
import com.api.coffeeapp.services.ICreditCardService;

@Service
public class CreditCardService implements ICreditCardService {

    private final CreditCardRepository creditCardRepository;
    private final FirebaseTokenUtil firebaseTokenUtil;

    public CreditCardService(CreditCardRepository creditCardRepository, FirebaseTokenUtil firebaseTokenUtil) {
        this.creditCardRepository = creditCardRepository;
        this.firebaseTokenUtil = firebaseTokenUtil;
    }

    @Override
    @Transactional
    public CreditCard getUserCredCard(String token) throws Exception {
        String userUid = firebaseTokenUtil.getUserIdFromToken(token);

        CreditCard creditCardEncrypted = creditCardRepository.findFirstByUserUid(userUid);

        if (creditCardEncrypted == null) {
            return null;
        }

        byte[] salt = Base64.getDecoder().decode(creditCardEncrypted.saltValue);
        String key = BasedEncryptionUtil.generateKeyFromUid(userUid, salt);

        CreditCard creditCard = new CreditCard();
        creditCard.lastDigits = AESUtil.decrypt(creditCardEncrypted.lastDigits, key);
        creditCard.expiryDate = AESUtil.decrypt(creditCardEncrypted.expiryDate, key);
        creditCard.holderName = AESUtil.decrypt(creditCardEncrypted.holderName, key);

        return creditCard;
    }

    @Override
    @Transactional
    public void saveCreditCard(CreditCard newCreditCard, String token) throws Exception {
        String userUid = firebaseTokenUtil.getUserIdFromToken(token);

        CreditCard existingCreditCard = creditCardRepository.findFirstByUserUid(userUid);

        byte[] salt = SaltGeneratorUtil.generateSalt(16);
        String key = BasedEncryptionUtil.generateKeyFromUid(userUid, salt);

        CreditCard creditCardToSave = new CreditCard();

        if (existingCreditCard != null) {
            creditCardToSave.id = existingCreditCard.id;
        }

        creditCardToSave.lastDigits = AESUtil.encrypt(newCreditCard.lastDigits, key);
        creditCardToSave.expiryDate = AESUtil.encrypt(newCreditCard.expiryDate, key);
        creditCardToSave.holderName = AESUtil.encrypt(newCreditCard.holderName, key);
        creditCardToSave.userUid = userUid;
        creditCardToSave.saltValue = Base64.getEncoder().encodeToString(salt);

        creditCardRepository.save(creditCardToSave);
    }

}
