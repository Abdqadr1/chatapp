package com.qadr.chatroom.repo;

import com.qadr.chatroom.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@DataMongoTest
class UserRepositoryTest {
    @Autowired private UserRepository repo;

    @BeforeEach
    public void before(){
       User user = new User(
                "id1",
                "+2348115213342",
                "User One",
                "photo", "imagePath",
                "available",
                LocalDateTime.now(),
                "password",
                LocalDateTime.now().minusWeeks(2)
        );
//       repo.save(user);
    }

    @Test
    void getAllUsers() {
        List<User> all = repo.findAll();
        System.out.println(all);
        assertThat(all.size()).isGreaterThan(0);
    }

    @Test
    void findByPhoneNumber() {
        String number = "+2348115213342";
        Optional<User> byPhoneNumber = repo.findByPhoneNumber(number);
        assertThat(byPhoneNumber).isPresent();
    }
}