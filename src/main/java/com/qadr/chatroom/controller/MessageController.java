package com.qadr.chatroom.controller;


import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.model.MessageStatus;
import com.qadr.chatroom.model.SocketMessage;
import com.qadr.chatroom.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;


@Controller
public class MessageController {
    @Autowired private MessageService messageService;

    @MessageMapping("/chat/{key}")
    public void sendMessage(@DestinationVariable String key,  @Payload SocketMessage message) {
        System.out.println(message);
        message.setStatus(MessageStatus.SENT);
        messageService.saveAndSend(message, key);
    }

}
