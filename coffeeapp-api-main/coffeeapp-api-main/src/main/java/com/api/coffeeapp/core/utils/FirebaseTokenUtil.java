package com.api.coffeeapp.core.utils;

import org.springframework.stereotype.Component;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

@Component
public class FirebaseTokenUtil {

    private final FirebaseAuth firebaseAuth;

    public FirebaseTokenUtil(FirebaseAuth firebaseAuth) {
        this.firebaseAuth = firebaseAuth;
    }

    public FirebaseToken decodeToken(String token) throws Exception {
        try {
            return firebaseAuth.verifyIdToken(token);
        } catch (Exception e) {
            throw new Exception("Invalid Firebase token", e);
        }
    }

    public String getUserIdFromToken(String token) {
        try {
            FirebaseToken decodedToken = decodeToken(token);
            return decodedToken.getUid();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return null;
    }
}
