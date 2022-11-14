package com.qadr.chatroom.controller;

import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.model.User;
import com.qadr.chatroom.model.UserDTO;
import com.qadr.chatroom.s3.AmazonS3Util;
import com.qadr.chatroom.s3.Constants;
import com.qadr.chatroom.s3.S3Properties;
import com.qadr.chatroom.service.MessageService;
import com.qadr.chatroom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

import static com.qadr.chatroom.s3.S3Properties.USER_IMAGE_FOLDER_NAME;

@RestController
public class UserController {
    @Autowired private UserService userService;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private MessageService messageService;
    @Autowired private AmazonS3Util amazonS3Util;
    @Autowired private S3Properties s3Properties;

    @PostMapping("/api/register")
    public void signUp(User user){
        userService.registerUser(user);
    }

    @GetMapping("/api/search-number/{number}")
    public UserDTO search(@PathVariable("number") String number){
        return userService.search(number);
    }

    @GetMapping("/api/get-contact-status/{current}/{number}")
    public UserDTO getContactStatus(@PathVariable("number") String number,
                                    @PathVariable("current") String current){
        userService.updateStatus(current);
        return userService.search(number);
    }


    @GetMapping("/api/get-messages/{from}/{to}")
    public List<Message> getChat(@PathVariable("from") String from, @PathVariable("to") String to){
        return messageService.getChatBetween(from, to);
    }

    @GetMapping("/api/get-user-messages/{number}")
    public List<Message> getChat(@PathVariable String number){
        return messageService.getUserMessages(number);
    }

    @PutMapping("/api/update-status/{number}")
    public void updateStatus(@PathVariable String number){
        userService.updateStatus(number);
    }


    @PutMapping("/api/update-info/{number}")
    public String updateUserInfo(@RequestParam("bio") String bio,
                                 @PathVariable String number,
                                 @RequestParam("image")MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            String folder = Constants.USER_IMAGE_FOLDER_NAME + "/" + number;
            String fileName = file.getOriginalFilename();
            amazonS3Util.removeFolder(folder);
            amazonS3Util.uploadFile(folder, fileName, file.getInputStream());
            String photo = s3Properties.getURI() + URLEncoder.encode(folder + "/" + fileName, StandardCharsets.UTF_8);
            userService.updateInfo(bio, number, fileName);
            return photo;
        }
        userService.updateInfo(bio, number, "");
        return "";
    }

}
