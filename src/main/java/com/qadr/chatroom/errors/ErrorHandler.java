package com.qadr.chatroom.errors;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;

@ControllerAdvice
public class ErrorHandler {

    @ExceptionHandler({ResponseStatusException.class})
    public ResponseEntity<?> handleException(ResponseStatusException ex){
        ErrorDTO dto = new ErrorDTO(
                ex.getMessage(),
                ex.getStatus(),
                LocalDateTime.now()
        );

        return ResponseEntity.ok(dto);
    }


    @AllArgsConstructor
    static class ErrorDTO{
        private String message;
        private HttpStatus status;
        private LocalDateTime time;
    }

}
