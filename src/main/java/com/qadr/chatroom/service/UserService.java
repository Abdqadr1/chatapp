package com.qadr.chatroom.service;

import com.qadr.chatroom.errors.CustomException;
import com.qadr.chatroom.model.MyUserDetails;
import com.qadr.chatroom.model.User;
import com.qadr.chatroom.model.UserDTO;
import com.qadr.chatroom.repo.UserRepository;
import com.qadr.chatroom.s3.S3Properties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;


@Service
public class UserService implements UserDetailsService {
    @Autowired private UserRepository userRepository;
    @Autowired private BCryptPasswordEncoder bCryptPasswordEncoder;
    @Autowired private S3Properties s3Properties;


    public User registerUser(User user){
        Optional<User> byPhoneNumber = getByPhoneNumber(user.getPhoneNumber());
        if(byPhoneNumber.isPresent())
            throw new CustomException(HttpStatus.BAD_REQUEST, "Phone number already exists");
        user.setCreated_at(LocalDateTime.now());
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        user.setLastSeen(LocalDateTime.now());
        return userRepository.save(user);
    }

    public Optional<User> getByPhoneNumber(String number){
        return userRepository.findByPhoneNumber(number);
    }

    public UserDTO search(String number) {
        User byPhoneNumber = getByPhoneNumber(number)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Could not find user"));

        return new UserDTO(byPhoneNumber, s3Properties);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User byPhoneNumber = getByPhoneNumber(username)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Could not find user with number " + username));
        return new MyUserDetails(byPhoneNumber);
    }

    public void updateStatus(String number) {
        User byPhoneNumber = getByPhoneNumber(number)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Could not find user with number" + number));
        byPhoneNumber.setLastSeen(LocalDateTime.now());
        userRepository.save(byPhoneNumber);
    }

    public void updateInfo(String bio, String number, String photo) {
        User byPhone = getByPhoneNumber(number)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND, "Could not find user with number "+number));
        byPhone.setBio(bio.isEmpty() ? byPhone.getBio() : bio);
        byPhone.setLastSeen(LocalDateTime.now());
        byPhone.setPhoto(photo.isEmpty() ? byPhone.getPhoto() :  photo);
        userRepository.save(byPhone);
    }

}
