package com.qadr.chatroom.s3;

public class Constants {
    private static final String BUCKET_NAME = "spring-chat-room";
    private static final String BUCKET_REGION = "us-east-1";
    public static final String USER_IMAGE_FOLDER_NAME = "user-photos";
    public static final String CHAT_FOLDER_NAME = "chat-files";
    public static final String S3_BASE_URI;

    static {
        String pattern = "https://%s.s3.%s.amazonaws.com/";
        S3_BASE_URI = String.format(pattern, BUCKET_NAME, BUCKET_REGION);
    }
}
