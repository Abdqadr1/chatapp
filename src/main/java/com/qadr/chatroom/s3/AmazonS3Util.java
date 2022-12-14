package com.qadr.chatroom.s3;

import com.qadr.chatroom.errors.CustomException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class AmazonS3Util {
    public static final Logger LOGGER = LoggerFactory.getLogger(AmazonS3Util.class);
    private static final String BUCKET_NAME,BUCKET_REGION;

    static {
        BUCKET_NAME = System.getenv("AWS_BUCKET_NAME");
        BUCKET_REGION = System.getenv("AWS_BUCKET_REGION");
    }

    private static List<S3Object> listFolderObjects (String folderName){
        S3Client s3Client = S3Client.builder()
                .region(Region.of(BUCKET_REGION)).build();
        ListObjectsRequest listObjectsRequest =
                ListObjectsRequest.builder().bucket(BUCKET_NAME).prefix(folderName).build();
        ListObjectsResponse listObjectsResponse = s3Client.listObjects(listObjectsRequest);
        return listObjectsResponse.contents();
    }

    public static List<String> listFolderKey(String folderName){
        folderName = folderName.endsWith("/") ? folderName : folderName+"/";
        return listFolderObjects(folderName)
                .stream()
                .map(S3Object::key).collect(Collectors.toList());
    }

    public static void uploadFile(String folderName, String fileName, InputStream inputStream){
        try {
            Map<String, String> data = new HashMap<>();
            data.put("date", new Date().toString());
            S3Client s3Client = S3Client.builder()
                    .region(Region.of(BUCKET_REGION)).build();
            PutObjectRequest putObjectRequest =
                    PutObjectRequest.builder().bucket(BUCKET_NAME)
                            .key(folderName + "/" + fileName).acl("public-read")
                            .metadata(data)
                            .build();
            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(inputStream,inputStream.available())
            );
        } catch (Exception e) {
            LOGGER.error("Could not upload file", e);
            throw new CustomException(HttpStatus.INTERNAL_SERVER_ERROR, "Error uploading file");
        }
    }

    public static void deleteFile(String key){
        S3Client s3Client = S3Client.builder()
                .region(Region.of(BUCKET_REGION)).build();
        DeleteObjectRequest deleteObjectRequest =
                DeleteObjectRequest.builder().bucket(BUCKET_NAME)
                        .key(key).build();
        s3Client.deleteObject(deleteObjectRequest);
        System.out.println("Deleted: " + key);
    }

    public static void removeFolder(String folderName){
        folderName = folderName.endsWith("/") ? folderName : folderName+"/";
        List<String> keys = listFolderKey(folderName);
        keys.forEach(AmazonS3Util::deleteFile);
    }

}
