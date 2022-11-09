package com.qadr.chatroom.controller;


import com.qadr.chatroom.model.MessageStatus;
import com.qadr.chatroom.model.SocketMessage;
import com.qadr.chatroom.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
public class MessageController {
    @Autowired private MessageService messageService;

    @MessageMapping("/chat/{key}")
    public void sendMessage(@DestinationVariable String key,  @Payload SocketMessage message) {
        message.setStatus(MessageStatus.SENT);
        messageService.saveAndSend(message, key);
    }

    @PutMapping("/api/upload-photos/{number}")
    public String uploadPhotos(@RequestParam("image") MultipartFile file,
                               @PathVariable("number") String number) throws InterruptedException {
        System.out.println(file);
        if (file == null || file.isEmpty()) return "";
        return messageService.uploadPhoto(file);
    }

}
