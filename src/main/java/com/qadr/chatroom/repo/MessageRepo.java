package com.qadr.chatroom.repo;

import com.qadr.chatroom.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;

public interface MessageRepo extends MongoRepository<Message, String> {

    @Query("{ $or: [{receiver: ?0, sender: ?1}, {sender : ?0, receiver: ?1}] }")
    List<Message> getMessagesBetween(String from, String to);

    @Query("{ $or: [{receiver: ?0}, {sender: ?0}] }")
    List<Message> getAllMessages(String number);

    List<Message> findByDateLessThan(Date date);

}
