package com.qadr.chatroom.controller;

import com.qadr.chatroom.model.User;
import com.qadr.chatroom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    @Autowired
    private UserService userService;

    public User signUp(User user){
        return userService.registerUser(user);
    }
}
