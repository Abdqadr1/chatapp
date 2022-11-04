package com.qadr.chatroom.service;

import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.model.SocketMessage;
import com.qadr.chatroom.repo.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class MessageService {
    @Autowired private MessageRepo messageRepo;

    public Message save(SocketMessage msg){
        Message message = new Message(msg);
        message.setDate(LocalDateTime.now());
        return messageRepo.save(message);
    }

}
