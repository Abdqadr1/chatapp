package com.qadr.chatroom.repo;

import com.qadr.chatroom.model.Message;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class MessageRepoTest {
    @Autowired private MessageRepo messageRepo;


    @Test
    public void testGetMessages(){
        String from = "+376123456789";
        String to = "+2348115213342";
        List<Message> messagesBetween = messageRepo.getMessagesBetween(from, to);
        System.out.println(messagesBetween);
    }


}