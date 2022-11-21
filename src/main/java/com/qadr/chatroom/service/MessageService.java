package com.qadr.chatroom.service;

import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.model.SocketMessage;
import com.qadr.chatroom.repo.MessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MessageService {
    @Autowired private MessageRepo messageRepo;
    @Autowired private SimpMessagingTemplate simpleMessagingTemplate;

    public void saveAndSend(SocketMessage msg, String key){
        Message message = new Message(msg);
        message.setDate(new Date());
        Message save = messageRepo.save(message);

        simpleMessagingTemplate.convertAndSend("/topic/messages/"+message.getReceiver(), save);
        message.setKey(key);
        simpleMessagingTemplate.convertAndSend(
                "/topic/sent/"+message.getSender(), message
        );
    }

    public List<Message> getChatBetween(String from, String to) {
        return messageRepo.getMessagesBetween(from, to);
    }

    public List<Message> getUserMessages(String number) {
        return messageRepo.getAllMessages(number);
    }
}
