package com.qadr.chatroom.repo;

import com.qadr.chatroom.model.Message;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@SpringBootTest
class MessageRepoTest {
    @Autowired private MessageRepo messageRepo;

//    @BeforeEach
//    public void before(){
//        Message msg = new Message();
//        msg.setSender("+376123456789");
//        msg.setReceiver("+2348115213342");
//        msg.setDate(new Date());
//        msg.setStatus(MessageStatus.SENT);
//        msg.setText("Testing");
//        messageRepo.save(msg);
//    }

    @Test
    public void testGetMessagesBetween(){
        String from = "+376123456789";
        String to = "+2348115213342";
        List<Message> messagesBetween = messageRepo.getMessagesBetween(from, to);
        messagesBetween.forEach(System.out::println);
        assertThat(messagesBetween.size()).isGreaterThan(0);
    }

    @Test
    public void testGetMessages(){
        String number = "+376123456789";
        List<Message> messages = messageRepo.getAllMessages(number);
        messages.forEach(System.out::println);
        assertThat(messages.size()).isGreaterThan(0);
    }

    @Test
    public void getAllMsgs(){
        List<Message> all = messageRepo.findAll();
        System.out.println(all.size());
        all.forEach(System.out::println);
        assertThat(all.size()).isGreaterThan(0);
    }

}