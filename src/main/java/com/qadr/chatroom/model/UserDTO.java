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
    private String firstName;
    private String lastName;
    private String photo;
    private LocalDateTime lastSeen;

    public UserDTO (User user){
        phoneNumber = user.getPhoneNumber();
        firstName = user.getFirstName();
        lastName = user.getLastName();
        photo = user.getPhoto();
        lastSeen = user.getLastSeen();
    }

    public boolean getStatus(){
        if(lastSeen == null) return false;
        LocalDateTime fiveMinAgo = LocalDateTime.now().minusMinutes(5L);
        return lastSeen.isAfter(fiveMinAgo);
    }
}
