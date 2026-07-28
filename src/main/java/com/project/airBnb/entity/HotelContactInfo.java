package com.project.airBnb.entity;


import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable  //it doesn't create separate table (reuse a group of field inside another entity)
//used on the class whose fields will be embedded into another entity
public class HotelContactInfo {
    private String address;
    private String phoneNumber;
    private String email;
    private String location;
}
