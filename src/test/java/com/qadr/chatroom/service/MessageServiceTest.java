package com.qadr.chatroom.service;

import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.model.MessageStatus;
import com.qadr.chatroom.model.User;
import com.qadr.chatroom.repo.MessageRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Date;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

@SpringBootTest
@AutoConfigureMockMvc
class MessageServiceTest {
    @MockBean private MessageRepo repo;
    @Autowired private MessageService messageService;

    public List<Message> messageList(){
        return List.of(
               new Message(
                       "msg one",
                       "+2348115213342",
                       "+376123456789",
                       "text", "", "", "",
                       new Date(), MessageStatus.SENT,null
               ),
                new Message(
                        "msg two",
                        "+2348115213342",
                        "+376123456789",
                        "text", "", "", "",
                        new Date(), MessageStatus.SENT,null
                )
        );
    }

    @BeforeEach
    void setUP(){
        given(repo.getAllMessages(anyString())).willReturn(messageList());
        given(repo.getMessagesBetween(anyString(), anyString())).willReturn(messageList());
    }

    @Test
    void getChatBetween() {
        List<Message> chatBetween = messageService.getChatBetween("one", "two");
        assertThat(chatBetween.size()).isGreaterThan(0);
    }

    @Test
    void getUserMessages() {
        List<Message> messages = messageService.getUserMessages("user");
        assertThat(messages.size()).isGreaterThan(0);
    }
}