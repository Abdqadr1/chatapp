package com.qadr.chatroom.model;

import com.qadr.chatroom.s3.Constants;
import com.qadr.chatroom.s3.S3Properties;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;

import static com.qadr.chatroom.s3.S3Properties.CHAT_FOLDER_NAME;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    private String sender, receiver, text;
    private String photo, audio;
    private Date date;
    private MessageStatus status;

    public String getImagePath (){
        return photo == null || photo.isEmpty() ? "" : Constants.S3_BASE_URI +
                CHAT_FOLDER_NAME + "/" +
                URLEncoder.encode(sender, StandardCharsets.UTF_8) + "/" + photo;
    }

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
        audio = msg.getAudio();
    }

}
