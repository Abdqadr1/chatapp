package com.qadr.chatroom.repo;

import com.qadr.chatroom.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest {
    @Autowired private UserRepository repo;

    @Test
    void findByPhoneNumber() {
        String number = "+2348115213342";
        Optional<User> byPhoneNumber = repo.findByPhoneNumber(number);
        assertThat(byPhoneNumber).isPresent();
    }
}