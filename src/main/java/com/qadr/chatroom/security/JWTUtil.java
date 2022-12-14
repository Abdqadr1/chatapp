package com.qadr.chatroom.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Date;
import java.util.stream.Collectors;

public class JWTUtil {
    private static final String JWT_KEY;
    static {
        JWT_KEY = System.getProperty("JWT_KEY", "my_secret_key");
    }
    private static final Algorithm algorithm = Algorithm.HMAC256(JWT_KEY.getBytes());
    public static String createAccessToken (User user, String path){
        return JWT.create()
                .withSubject(user.getUsername())
                .withIssuer(path)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 6 * 60 * 60 * 1000))
                .withClaim("roles",
                        user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .sign(algorithm);
    }

    public static String createRefreshToken (User user){
        return JWT.create()
                .withSubject(user.getUsername())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 24 * 60 * 60 * 1000))
                .withClaim("roles",
                        user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .sign(algorithm);
    }

    public static DecodedJWT verifyToken(String token){
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }


}
