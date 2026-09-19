package com.project.airBnb.util;

import com.project.airBnb.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;

public class AppUtil {
    public static User getCurrentUser(){
        User user= new User();
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();


    }
}
