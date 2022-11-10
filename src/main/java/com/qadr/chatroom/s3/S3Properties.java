package com.qadr.chatroom.s3;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "aws.s3")
@Data
public class S3Properties {

    private String accessKey;
    private String secretKey;
    private String bucketName;
    private String bucketRegion;

    public static final String USER_IMAGE_FOLDER_NAME = "user-photos";
    public static final String CHAT_FOLDER_NAME = "chat-files";


    public String getURI(){
        String pattern = "https://%s.s3.%s.amazonaws.com/";
        String uri = String.format(pattern, bucketName, bucketRegion);
        return bucketName == null ? "" : uri;
    }
}
