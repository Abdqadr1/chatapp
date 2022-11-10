package com.qadr.chatroom;

import com.qadr.chatroom.s3.S3Properties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ChatroomApplication {

	public static void main(String[] args) {
		SpringApplication.run(ChatroomApplication.class, args);
	}

}
