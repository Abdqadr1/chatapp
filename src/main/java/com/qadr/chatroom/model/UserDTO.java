package com.qadr.chatroom.model;

import com.qadr.chatroom.s3.Constants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

import static com.qadr.chatroom.s3.Constants.USER_IMAGE_FOLDER_NAME;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    private String phoneNumber;
    private String name;
    private String photo, imagePath;
    private String bio;
    private LocalDateTime lastSeen;

    public UserDTO (User user){
        phoneNumber = user.getPhoneNumber();
        name = user.getName();
        lastSeen = user.getLastSeen();
        photo = user.getPhoto();
        bio = user.getBio();
        imagePath = getImagePath();
    }


    public boolean getStatus(){
        if(lastSeen == null) return false;
        LocalDateTime fiveMinAgo = LocalDateTime.now().minusMinutes(5L);
        return lastSeen.isAfter(fiveMinAgo);
    }

    public String getImagePath (){
        return photo == null || photo.isBlank() ? "" : Constants.S3_BASE_URI + USER_IMAGE_FOLDER_NAME + "/" +
                URLEncoder.encode(phoneNumber +"/" + photo, StandardCharsets.UTF_8);
    }
}
