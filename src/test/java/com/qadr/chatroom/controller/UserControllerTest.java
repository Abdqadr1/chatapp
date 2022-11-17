package com.qadr.chatroom.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void signUp() throws Exception {
        MvcResult mvcResult = mockMvc.perform
                        (post("/api/register")
                                .contentType(APPLICATION_JSON_VALUE)
                                .param("phoneNumber", "+376123456789")
                                .param("password", "mithun2020")
                        ).andExpect(status().isOk()).andDo(print())
                .andReturn();
        Void result =
                objectMapper.readValue(mvcResult.getResponse().getContentAsString(), Void.class);

        System.out.println(result);
    }

    @Test
    void search() {
    }

    @Test
    void getContactStatus() {
    }

    @Test
    void getChatBetween() {
    }

    @Test
    void getChat() {
    }

    @Test
    void updateStatus() {
    }

    @Test
    void updateUserInfo() {
    }
}