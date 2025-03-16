package com.api.coffeeapp.core.utils;

import java.security.SecureRandom;

public class SaltGeneratorUtil {

    public static byte[] generateSalt(int length) {
        if (length <= 0) {
            throw new IllegalArgumentException("Salt length must be positive");
        }

        SecureRandom secureRandom = new SecureRandom();

        byte[] salt = new byte[length];
        secureRandom.nextBytes(salt);

        return salt;
    }
}
