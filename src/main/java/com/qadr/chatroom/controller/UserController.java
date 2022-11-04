package com.qadr.chatroom.controller;

import com.qadr.chatroom.model.User;
import com.qadr.chatroom.model.UserDTO;
import com.qadr.chatroom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired private UserService userService;
    @Autowired private AuthenticationManager authenticationManager;

    @PostMapping("/api/register")
    public void signUp(User user){
        userService.registerUser(user);
    }

    @GetMapping("/api/search-number/{number}")
    public UserDTO search(@PathVariable("number") String number){
        return userService.search(number);
    }

}
