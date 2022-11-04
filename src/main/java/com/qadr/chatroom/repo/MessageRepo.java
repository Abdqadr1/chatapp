package com.qadr.chatroom.repo;

import com.qadr.chatroom.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRepo extends MongoRepository<Message, String> {

}
