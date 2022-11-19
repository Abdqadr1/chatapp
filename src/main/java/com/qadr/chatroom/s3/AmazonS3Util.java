package com.qadr.chatroom.s3;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class AmazonS3Util {
    public static final Logger LOGGER = LoggerFactory.getLogger(AmazonS3Util.class);
    private final String BUCKET_NAME,BUCKET_REGION;
    private final String accessKey, secretKey;

    public AmazonS3Util(@Autowired S3Properties s3Properties){
        BUCKET_NAME = s3Properties.getBucketName();
        BUCKET_REGION = s3Properties.getBucketRegion();
        accessKey = s3Properties.getAccessKey();
        secretKey = s3Properties.getSecretKey();
    }

    private List<S3Object> listFolderObjects (String folderName){
        S3Client s3Client = S3Client.builder()
                .credentialsProvider(new S3CredentialsProvider(accessKey, secretKey))
                .region(Region.of(BUCKET_REGION)).build();
        ListObjectsRequest listObjectsRequest =
                ListObjectsRequest.builder().bucket(BUCKET_NAME).prefix(folderName).build();
        ListObjectsResponse listObjectsResponse = s3Client.listObjects(listObjectsRequest);
        return listObjectsResponse.contents();
    }

    public List<String> listFolderKey(String folderName){
        folderName = folderName.endsWith("/") ? folderName : folderName+"/";
        return listFolderObjects(folderName)
                .stream()
                .map(S3Object::key).collect(Collectors.toList());
    }

    public void uploadFile(String folderName, String fileName, InputStream inputStream){
        S3Client s3Client = S3Client.builder()
                .credentialsProvider(new S3CredentialsProvider(accessKey, secretKey))
                .region(Region.of(BUCKET_REGION)).build();
        PutObjectRequest putObjectRequest =
                PutObjectRequest.builder().bucket(BUCKET_NAME)
                        .key(folderName + "/" + fileName).acl("public-read")
                        .build();
        putObjectRequest.metadata().put("date", new Date().toString());
        try {
            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(inputStream,inputStream.available())
            );
        } catch (IOException e) {
            LOGGER.error("Could not upload file", e);
        }
    }

    public void deleteFile(String key){
        S3Client s3Client = S3Client.builder()
                .credentialsProvider(new S3CredentialsProvider(accessKey, secretKey))
                .region(Region.of(BUCKET_REGION)).build();
        DeleteObjectRequest deleteObjectRequest =
                DeleteObjectRequest.builder().bucket(BUCKET_NAME)
                        .key(key).build();
        s3Client.deleteObject(deleteObjectRequest);
        System.out.println("Deleted: " + key);
    }

    public void removeFolder(String folderName){
        folderName = folderName.endsWith("/") ? folderName : folderName+"/";
        List<String> keys = listFolderKey(folderName);
        keys.forEach(this::deleteFile);
    }

}
