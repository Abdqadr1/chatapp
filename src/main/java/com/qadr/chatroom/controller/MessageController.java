package com.qadr.chatroom.controller;


import com.qadr.chatroom.model.MessageStatus;
import com.qadr.chatroom.model.SocketMessage;
import com.qadr.chatroom.s3.AmazonS3Util;
import com.qadr.chatroom.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Calendar;
import java.util.Date;

import static com.qadr.chatroom.s3.S3Properties.CHAT_FOLDER_NAME;


@RestController
public class MessageController {
    @Autowired private MessageService messageService;
    @Autowired private AmazonS3Util amazonS3Util;

    @MessageMapping("/chat/{key}")
    public void sendMessage(@DestinationVariable String key,  @Payload SocketMessage message) {
        message.setStatus(MessageStatus.SENT);
        System.out.println(message);
        messageService.saveAndSend(message, key);
    }

    @PutMapping("/api/upload-photos/{number}")
    public String uploadPhotos(@RequestParam("image") MultipartFile file,
                               @PathVariable("number") String number) throws InterruptedException, IOException {
        if (file == null || file.isEmpty()) return "";
        System.out.println(file.getContentType());
        String fileName = generateFileName(number, file);
        String folder = CHAT_FOLDER_NAME + "/" + number;
        amazonS3Util.uploadFile(folder, fileName, file.getInputStream());
        return fileName;
    }



    public String generateFileName(String phoneNumber, MultipartFile file){
        String prefix = file.getContentType().contains("image") ? "IMG_" : "FILE_";
        var name = new StringBuilder(prefix + phoneNumber.substring(1) + "_");
        Calendar calendar = Calendar.getInstance();
        name.append(calendar.get(Calendar.YEAR)).append("_");
        name.append(calendar.get(Calendar.MONTH)).append("_");
        name.append(calendar.get(Calendar.DAY_OF_MONTH)).append("_");
        name.append(calendar.get(Calendar.HOUR_OF_DAY)).append("_");
        name.append(calendar.get(Calendar.MINUTE)).append("_");
        name.append(calendar.get(Calendar.SECOND));
        return name.toString();
    }





}
