package com.qadr.chatroom.controller;


import com.qadr.chatroom.model.MessageStatus;
import com.qadr.chatroom.model.SocketMessage;
import com.qadr.chatroom.s3.AmazonS3Util;
import com.qadr.chatroom.s3.Constants;
import com.qadr.chatroom.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Calendar;


@RestController
public class MessageController {
    @Autowired private MessageService messageService;
    @Autowired private AuthController authController;

    public MessageController() {
    }

    @MessageMapping("/chat/{key}")
    public void sendMessage(@DestinationVariable String key,  @Payload SocketMessage message) {
        message.setStatus(MessageStatus.SENT);
        messageService.saveAndSend(message, key);
    }

    @PutMapping("/api/upload-files")
    public String uploadPhotos(@RequestParam("file") MultipartFile file) throws InterruptedException, IOException {
        String number = authController.getAuthNumber();
        if (file == null || file.isEmpty()) return "";
        String fileName = generateFileName(number, file);
        String folder = Constants.CHAT_FOLDER_NAME + "/" + number;
        AmazonS3Util.uploadFile(folder, fileName, file.getInputStream());
//        System.out.println(fileName + file.getSize());
        return fileName;
    }




    public String generatePrefix(String contentType){
        if(contentType.contains("image")) return "IMG_";
        if(contentType.contains("audio")) return "AUDIO_";
        return "FILE_";
    }

    public String generateFileName(String phoneNumber, MultipartFile file){
        String prefix = generatePrefix(file.getContentType());
        var name = new StringBuilder(prefix + phoneNumber.substring(1) + "_");
        Calendar calendar = Calendar.getInstance();
        name.append(calendar.get(Calendar.YEAR)).append("_");
        name.append(calendar.get(Calendar.MONTH)).append("_");
        name.append(calendar.get(Calendar.DAY_OF_MONTH)).append("_");
        name.append(calendar.get(Calendar.HOUR_OF_DAY)).append("_");
        name.append(calendar.get(Calendar.MINUTE)).append("_");
        name.append(calendar.get(Calendar.SECOND));
        String fileName = file.getOriginalFilename();
        int dot = fileName.lastIndexOf('.');
        String ext = fileName.substring(dot);
        return name.append(ext).toString();
    }
}
