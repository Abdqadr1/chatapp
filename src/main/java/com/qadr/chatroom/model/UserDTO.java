package com.qadr.chatroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private String phoneNumber;
    private String name;
    private String photo;
    private String bio;
    private LocalDateTime lastSeen;

    public UserDTO (User user){
        phoneNumber = user.getPhoneNumber();
        name = user.getName();
        photo = user.getPhoto();
        lastSeen = user.getLastSeen();
        bio = user.getBio();
    }

    public boolean getStatus(){
        if(lastSeen == null) return false;
        LocalDateTime fiveMinAgo = LocalDateTime.now().minusMinutes(5L);
        return lastSeen.isAfter(fiveMinAgo);
    }
}
