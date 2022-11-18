package com.qadr.chatroom.controller;

import com.qadr.chatroom.errors.CustomException;
import com.qadr.chatroom.security.JWTUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AuthController {
    @Autowired
    private AuthenticationManager authManager;


    @PostMapping("/api/auth")
    public ResponseEntity<Map<String, String>> login (LoginRequest loginRequest){

        try{
            var authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginRequest.getPhoneNumber(), loginRequest.getPassword());
            Authentication auth = authManager.authenticate(authenticationToken);
            User user = new User((String) auth.getPrincipal(), "", Collections.emptyList());
            Map<String, String> tokens = new HashMap<>();
            tokens.put("access_token", JWTUtil.createAccessToken(user, "/api/auth"));
            tokens.put("refresh_token", JWTUtil.createRefreshToken(user));
            tokens.put("phoneNumber", loginRequest.getPhoneNumber());
            return new ResponseEntity<>(tokens, HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            throw new CustomException(HttpStatus.BAD_REQUEST, "Incorrect phone number or password");
        }

    }
    public String getAuthNumber(){
        Object user =  SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        if(user instanceof User) return ((User) user).getUsername();
        return (String) user;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    static class LoginRequest{
        String phoneNumber;
        String password;
    }

}
