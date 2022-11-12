package com.qadr.chatroom.service;

import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.model.MessageStatus;
import com.qadr.chatroom.model.SocketMessage;
import com.qadr.chatroom.repo.MessageRepo;
import com.qadr.chatroom.repo.UserRepository;
import com.qadr.chatroom.s3.S3Properties;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static com.qadr.chatroom.s3.S3Properties.CHAT_FOLDER_NAME;

@Service
public class MessageService {
    @Autowired private MessageRepo messageRepo;
    @Autowired private SimpMessagingTemplate simpleMessagingTemplate;
    @Autowired private S3Properties s3Properties;

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

}
