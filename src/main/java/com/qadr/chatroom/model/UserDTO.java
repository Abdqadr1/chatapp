package com.qadr.chatroom.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private String phoneNumber;
    private String firstName;
    private String lastName;
    private String photo;

    public UserDTO (User user){
        phoneNumber = user.getPhoneNumber();
        firstName = user.getFirstName();
        lastName = user.getLastName();
        photo = user.getPhoto();
    }
}
