package com.qadr.chatroom.model;

import com.qadr.chatroom.s3.S3Properties;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;

import static com.qadr.chatroom.s3.S3Properties.USER_IMAGE_FOLDER_NAME;

@Data
@NoArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String phoneNumber;
    private String firstName;
    private String lastName;
    private String photo;
    private LocalDateTime lastSeen;

    private String password;

    private LocalDateTime created_at;

    public String getImagePath (@Autowired S3Properties s3Properties){
        return s3Properties.getURI() + USER_IMAGE_FOLDER_NAME + "/" + photo;
    }
}
