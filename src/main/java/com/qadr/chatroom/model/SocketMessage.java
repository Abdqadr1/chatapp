package com.qadr.chatroom.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.SimpleDateFormat;
import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SocketMessage {
    private String sender, receiver, text;
    private String photo, audio;
    private Date date;
    private MessageStatus status;

    public String getTime(){
        SimpleDateFormat format = new SimpleDateFormat("dddd-MM-yy HH:mm:ss");
        return format.format(date);
    }
}
