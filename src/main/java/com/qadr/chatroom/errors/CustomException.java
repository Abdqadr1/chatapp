package com.qadr.chatroom.errors;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;


@Data
public class CustomException extends RuntimeException{
    private HttpStatus status;
    private String message;
    public CustomException(HttpStatus status, String msg){
        super(msg);
        this.message = msg;
        this.status = status;
    }
}
