package com.qadr.chatroom.controller;

import com.qadr.chatroom.errors.CustomException;
import com.qadr.chatroom.model.Message;
import com.qadr.chatroom.model.User;
import com.qadr.chatroom.model.UserDTO;
import com.qadr.chatroom.s3.AmazonS3Util;
import com.qadr.chatroom.s3.Constants;
import com.qadr.chatroom.s3.S3Properties;
import com.qadr.chatroom.service.MessageService;
import com.qadr.chatroom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    @Autowired private AuthController authController;

    @PostMapping("/api/register")
    public void signUp(User user){
        userService.registerUser(user);
    }

    @GetMapping("/api/search-number/{number}")
    public UserDTO search(@PathVariable("number") String number){
        String current = authController.getAuthNumber();;
        if(current.equals(number)) throw new CustomException(HttpStatus.BAD_REQUEST, "Can't search self");
        return userService.search(number);
    }

    @GetMapping("/api/get-contact-status/{number}")
    public UserDTO getContactStatus(@PathVariable("number") String number){
        String current = authController.getAuthNumber();
        userService.updateStatus(current);
        return userService.search(number);
    }


    @GetMapping("/api/get-messages/{two}")
    public List<Message> getChatBetween(@PathVariable("two") String two){
        String one = authController.getAuthNumber();
        return messageService.getChatBetween(one, two);
    }

    @GetMapping("/api/get-user-messages")
    public List<Message> getChat(){
        String number = authController.getAuthNumber();
        return messageService.getUserMessages(number);
    }

    @PutMapping("/api/update-status")
    public void updateStatus(){
        String number = authController.getAuthNumber();
        userService.updateStatus(number);
    }


    @PutMapping("/api/update-info")
    public String updateUserInfo(@RequestParam("bio") String bio,
                                 @RequestParam(value = "image", required = false)MultipartFile file) throws IOException {
        String number = authController.getAuthNumber();
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
