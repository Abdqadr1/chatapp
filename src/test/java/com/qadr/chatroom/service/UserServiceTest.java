package com.qadr.chatroom.service;

import com.qadr.chatroom.model.User;
import com.qadr.chatroom.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@SpringBootTest
@AutoConfigureMockMvc
class UserServiceTest {
    @MockBean private UserRepository repo;
    @Autowired private UserService userService;

    public List<User> getList(){
        return List.of(
                new User(
                        "id1",
                        "+2348115213342",
                        "User One",
                        "photo", "imagePath",
                        "available",
                        LocalDateTime.now(),
                        "password",
                        LocalDateTime.now().minusWeeks(2)
                ),
                new User(
                        "id2",
                        "+376123456789",
                        "User Two",
                        "photo", "imagePath",
                        "available",
                        LocalDateTime.now(),
                        "password",
                        LocalDateTime.now().minusWeeks(2)
                )
        );
    }

    @BeforeEach
    void setUP(){
        given(repo.findByPhoneNumber(anyString())).willReturn(Optional.of(getList().get(0)));
        given(repo.save(any(User.class))).willReturn(getList().get(1));
    }

    @Test
    void getByPhoneNumber() {
        Optional<User> anyPhone = userService.getByPhoneNumber("any-phone");
        assertThat(anyPhone).isPresent();
        assertThat(anyPhone.get().getId()).isEqualTo(getList().get(0).getId());
    }

    @Test
    void registerUser() {
        given(repo.findByPhoneNumber(anyString())).willReturn(Optional.empty());
        User user = userService.registerUser(getList().get(0));
        assertThat(user).isNotNull();
        assertThat(user.getId()).isEqualTo(getList().get(1).getId());
    }


    @Test
    void searchReturnError() {
        given(repo.findByPhoneNumber(anyString())).willReturn(Optional.empty());
    }

    @Test
    void loadUserByUsername() {

    }

    @Test
    void updateStatus() {

    }

    @Test
    void updateInfo() {
    }
}