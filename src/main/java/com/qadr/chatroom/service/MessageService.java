package com.qadr.chatroom.service;

import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.model.MessageStatus;
import com.qadr.chatroom.model.SocketMessage;
import com.qadr.chatroom.repo.MessageRepo;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class MessageService {
    @Autowired private MessageRepo messageRepo;
    @Autowired private SimpMessagingTemplate simpleMessagingTemplate;

    public void saveAndSend(SocketMessage msg, String key){
        Message message = new Message(msg);
        message.setDate(new Date());
        messageRepo.save(message);
        simpleMessagingTemplate.convertAndSend("/topic/messages/"+message.getReceiver(), message);
        simpleMessagingTemplate.convertAndSend(
                "/topic/sent/"+message.getSender(),
                new MessageReport(message, key)
        );
    }

    public List<Message> getChatBetween(String from, String to) {
        return messageRepo.getMessagesBetween(from, to);
    }

    @Data
    @NoArgsConstructor
    static class MessageReport{
        private MessageStatus status;
        private Date date;
        private String id;
        private String time;
        private String key, receiver;

        public MessageReport (Message message, String key){
            status = message.getStatus();
            date = message.getDate();
            id = message.getId();
            receiver = message.getReceiver();
            this.key = key;
        }
        public String getTime(){
            SimpleDateFormat format = new SimpleDateFormat("dddd-MM-yy HH:mm:ss");
            return format.format(date);
        }

    }
}
