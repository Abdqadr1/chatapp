package com.qadr.chatroom.controller;

import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.model.User;
import com.qadr.chatroom.model.UserDTO;
import com.qadr.chatroom.service.MessageService;
import com.qadr.chatroom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    @Autowired private UserService userService;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private MessageService messageService;

    @PostMapping("/api/register")
    public void signUp(User user){
        userService.registerUser(user);
    }

    @GetMapping("/api/search-number/{number}")
    public UserDTO search(@PathVariable("number") String number){
        return userService.search(number);
    }

    @GetMapping("/api/get-contact-status/{current}/{number}")
    public UserDTO getContactStatus(@PathVariable("number") String number,
                                    @PathVariable("current") String current){
        userService.updateStatus(current);
        return userService.search(number);
    }


    @GetMapping("/api/get-messages/{from}/{to}")
    public List<Message> getChat(@PathVariable("from") String from, @PathVariable("to") String to){
        return messageService.getChatBetween(from, to);
    }

    @PutMapping("/api/update-status/{number}")
    public void updateStatus(@PathVariable String number){
        userService.updateStatus(number);
    }


}
