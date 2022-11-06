package com.qadr.chatroom.service;

import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.model.SocketMessage;
import com.qadr.chatroom.repo.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import java.util.Date;
import java.util.List;

@Service
public class MessageService {
    @Autowired private MessageRepo messageRepo;
    @Autowired private SimpMessagingTemplate simpleMessagingTemplate;

    public void saveAndSend(SocketMessage msg, String to){
        Message message = new Message(msg);
        message.setDate(new Date());
        messageRepo.save(message);
        simpleMessagingTemplate.convertAndSend("/topic/messages/"+to, message);
    }

    public List<Message> getChatBetween(String from, String to) {
        return messageRepo.getMessagesBetween(from, to);
    }
}
