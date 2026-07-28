package com.project.airBnb.dto;

//import com.project.airBnb.entity.Booking;
//import com.project.airBnb.entity.User;
import com.project.airBnb.entity.enums.Gender;
import lombok.Data;

import java.util.Set;

@Data
public class GuestDto {
    private Long id;
    //private User user;
    private String name;
    private Gender gender;
    private Integer age;
    //private Set<BookingDto> bookings;
}
