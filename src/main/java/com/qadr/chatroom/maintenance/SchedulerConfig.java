package com.qadr.chatroom.maintenance;

import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.repo.MessageRepo;
import com.qadr.chatroom.s3.AmazonS3Util;
import com.qadr.chatroom.s3.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@EnableScheduling
@Configuration
public class SchedulerConfig {
    @Autowired private MessageRepo messageRepo;
    @Autowired private AmazonS3Util amazonS3Util;

    @Scheduled(fixedRate = 1, timeUnit = TimeUnit.DAYS)
    public void deleteOldMessages(){
        LocalDateTime fiveDaysAgo = LocalDateTime.now().minusDays(3);
        Instant instant = fiveDaysAgo.toInstant(ZoneOffset.UTC);
        Date date = Date.from(instant);
        List<Message> all = messageRepo.findByDateLessThan(date);
        List<Message> collect = all.stream().filter(msg ->{
            System.out.println(msg.getDate());
                return (msg.getPhoto() != null && !msg.getPhoto().isBlank()) ||
                (msg.getAudio() != null && !msg.getAudio().isBlank()) ||
                (msg.getDocument() != null && !msg.getDocument().isBlank());}
        ).collect(Collectors.toList());
        collect.forEach(msg -> {
            String folderName = Constants.CHAT_FOLDER_NAME + "/" + msg.getSender() + "/";
            if(msg.getPhoto() != null && !msg.getPhoto().isBlank()){
                amazonS3Util.deleteFile(folderName+msg.getPhoto());
            }
            if(msg.getAudio() != null && !msg.getAudio().isBlank()){
                amazonS3Util.deleteFile(folderName+msg.getAudio());
            }
            if(msg.getDocument() != null && !msg.getDocument().isBlank()){
                amazonS3Util.deleteFile(folderName+msg.getDocument());
            }
        });
        messageRepo.deleteAll(all);
    }

}
