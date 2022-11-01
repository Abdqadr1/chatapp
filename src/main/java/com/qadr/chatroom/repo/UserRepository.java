package com.qadr.chatroom.repo;

import com.qadr.chatroom.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByPhone(String number);

}