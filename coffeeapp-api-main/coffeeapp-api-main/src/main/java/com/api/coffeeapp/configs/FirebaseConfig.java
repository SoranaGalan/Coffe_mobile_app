package com.api.coffeeapp.configs;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;

@Configuration
public class FirebaseConfig {

    private final static String ADMIN_SDK_CONFIG_FILE = "/firebase-services-account-key.json";

    @Bean
    public FirebaseAuth firebaseAuth() throws IOException {
        InputStream serviceAccount = FirebaseConfig.class.getResourceAsStream(ADMIN_SDK_CONFIG_FILE);

        if (serviceAccount == null) {
            throw new FileNotFoundException("Resource not found: " + ADMIN_SDK_CONFIG_FILE);
        }

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        FirebaseApp.initializeApp(options);

        return FirebaseAuth.getInstance();
    }
}
