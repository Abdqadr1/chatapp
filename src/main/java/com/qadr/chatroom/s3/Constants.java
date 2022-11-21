package com.qadr.chatroom.s3;

public class Constants {
    public static final String USER_IMAGE_FOLDER_NAME = "user-photos";
    public static final String CHAT_FOLDER_NAME = "chat-files";
    public static final String S3_BASE_URI;

    static {
        String bucketName = System.getenv("AWS_BUCKET_NAME");
        String bucketRegion = System.getenv("AWS_BUCKET_REGION");
        String pattern = "https://%s.s3.%s.amazonaws.com/";
        String uri = String.format(pattern, bucketName, bucketRegion);
        S3_BASE_URI = bucketName == null ? "" : uri;
    }
}
