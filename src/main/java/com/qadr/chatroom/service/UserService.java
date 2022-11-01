package com.qadr.chatroom.service;

import com.qadr.chatroom.model.User;
import com.qadr.chatroom.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user){
        Optional<User> byPhoneNumber = getByPhoneNumber(user.getPhoneNumber());
        if(byPhoneNumber.isPresent())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number already exists");
        user.setCreated_at(LocalDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> getByPhoneNumber(String number){
        return userRepository.findByPhone(number);
    }

}
