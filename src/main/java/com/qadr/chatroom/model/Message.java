package com.qadr.chatroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.text.SimpleDateFormat;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String sender, receiver, text;
    private String photo;
    private Date date;
    private MessageStatus status;

    public String getTime(){
        SimpleDateFormat format = new SimpleDateFormat("dddd-MM-yy HH:mm:ss");
        return format.format(date);
    }

    public Message (SocketMessage msg){
        text = msg.getText();
        sender = msg.getSender();
        receiver = msg.getReceiver();
        photo = msg.getPhoto();
        date = msg.getDate();
        status = msg.getStatus();
    }
}
