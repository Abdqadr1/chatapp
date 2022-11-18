package com.qadr.chatroom.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qadr.chatroom.model.UserDTO;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Rollback
public class UserControllerTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    public static final String number = "+37623450789";
    public static final String number2 = "+27623450789";

    @Test
    @Order(1)
    void signUpNewUsers() throws Exception {
         mockMvc.perform
                (post("/api/register")
                        .contentType(APPLICATION_JSON_VALUE)
                        .param("phoneNumber", number)
                        .param("name", "Test user 1")
                        .param("password", "test")
                ).andExpect(status().isOk()).andDo(print());

         // second users
        mockMvc.perform
                (post("/api/register")
                        .contentType(APPLICATION_JSON_VALUE)
                        .param("phoneNumber", number2)
                        .param("name", "Test user 2")
                        .param("password", "test2")
                ).andExpect(status().isOk()).andDo(print());
    }

    @Test
    @Order(2)
    void signUpDuplicateUser() throws Exception {
        mockMvc.perform
                (post("/api/register")
                        .contentType(APPLICATION_JSON_VALUE)
                        .param("phoneNumber", number)
                        .param("name", "Test name")
                        .param("password", "test")
                ).andExpect(status().isBadRequest()).andDo(print());
    }

    @Test
    @Order(3)
    @WithMockUser(username = number, password = "pass")
    void searchSelfReturnBadRequest() throws Exception {
        mockMvc.perform(get("/api/search-number/" + number))
                .andExpect(status().isBadRequest())
                .andDo(print()).andReturn();
    }


    @Test
    @Order(4)
    @WithMockUser(username = number2, password = "pass")
    void searchExistingUser() throws Exception {
        MvcResult mvcResult = mockMvc.perform(get("/api/search-number/" + number))
                .andExpect(status().isOk())
                .andDo(print()).andReturn();
        UserDTO res = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), UserDTO.class);
        assertThat(res.getPhoneNumber()).isEqualTo(number);
    }

    @Test
    @Order(5)
    @WithMockUser(username = number, password = "pass")
    void searchNotExistingUser() throws Exception {
        mockMvc.perform(get("/api/search-number/0" + number+45))
                .andExpect(status().isNotFound())
                .andDo(print());
    }

    @Test
    @Order(6)
    @WithMockUser(username = number, password = "pass")
    void updateUserInfo() throws Exception {
        String bio = "testing bio";
        mockMvc.perform
                (put("/api/update-info")
                        .contentType(APPLICATION_JSON_VALUE)
                        .param("bio", bio)
                ).andExpect(status().isOk())
                .andDo(print());

        // test if bio has been updated
        MvcResult mvcResult = mockMvc.perform(get("/api/get-contact-status/" + number))
                .andExpect(status().isOk())
                .andDo(print()).andReturn();
        UserDTO res = objectMapper.readValue(mvcResult.getResponse().getContentAsString(), UserDTO.class);
        assertThat(res.getBio()).isEqualTo(bio);
        assertThat(res.getPhoneNumber()).isEqualTo(number);
    }
}