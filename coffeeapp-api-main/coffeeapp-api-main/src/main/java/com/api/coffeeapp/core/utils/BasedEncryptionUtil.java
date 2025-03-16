package com.api.coffeeapp.core.utils;

import java.util.Base64;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

public class BasedEncryptionUtil {

    private static final int ITERATIONS = 10000;
    private static final int KEY_LENGTH = 256;

    public static String generateKeyFromUid(String uid, byte[] salt) throws Exception {
        PBEKeySpec spec = new PBEKeySpec(uid.toCharArray(), salt, ITERATIONS, KEY_LENGTH);

        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");

        byte[] key = factory.generateSecret(spec).getEncoded();

        return Base64.getEncoder().encodeToString(key);
    }
}
