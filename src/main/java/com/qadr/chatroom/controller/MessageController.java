package com.qadr.chatroom.controller;


import com.qadr.chatroom.model.SocketMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MessageController {

    @MessageMapping("/message")
    @SendTo("/topic/message")
    public Object sendMessage(SocketMessage message) throws InterruptedException {
        Thread.sleep(1000);
        // TODO: 10/24/2022  do something with message
        return new Object();
    }

}
