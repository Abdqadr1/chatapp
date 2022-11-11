package com.qadr.chatroom.s3;

import lombok.ToString;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;

@ToString
public class S3CredentialsProvider implements AwsCredentialsProvider {
    private final String accessKey, secretKey;
    public S3CredentialsProvider(String accessKey, String secret) {
        this.accessKey = accessKey;
        this.secretKey = secret;
    }

    @Override
    public AwsCredentials resolveCredentials() {
        return AwsBasicCredentials.create(accessKey, secretKey);
    }
}
