package com.qadr.chatroom.errors;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class ErrorHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorDTO> handleCustomException(CustomException ex){
        ErrorDTO dto =  new ErrorDTO(
                ex.getMessage(),
                ex.getStatus(),
                LocalDateTime.now()
        );

        return new ResponseEntity<>(dto, ex.getStatus());
    }


    @AllArgsConstructor
    @Data
    static class ErrorDTO{
        private String message;
        private HttpStatus status;
        private LocalDateTime time;
    }

}
