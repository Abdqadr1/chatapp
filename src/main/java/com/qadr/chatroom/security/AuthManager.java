package com.qadr.chatroom.security;

import com.qadr.chatroom.errors.CustomException;
import com.qadr.chatroom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;

@Component
public class AuthManager implements AuthenticationManager {
    @Autowired private UserService userService;
    @Autowired private BCryptPasswordEncoder bCryptPasswordEncoder;


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        Object username = authentication.getPrincipal();
        var userDetails = userService.loadUserByUsername((String) username);
        if(bCryptPasswordEncoder.matches((CharSequence) authentication.getCredentials(), userDetails.getPassword())){
            var auth = new UsernamePasswordAuthenticationToken(
                    username,
                    userDetails.getPassword(),
                    Collections.emptyList()
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            return auth;
        }
        throw new CustomException(HttpStatus.BAD_REQUEST, "Bad Credentials");
    }
}
