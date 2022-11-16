package com.qadr.chatroom.model;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Document(collection = "users")
@AllArgsConstructor
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String phoneNumber;
    private String name;
    private String photo, imagePath;

    private String bio;
    private LocalDateTime lastSeen;

    private String password;

    private LocalDateTime created_at;
}
