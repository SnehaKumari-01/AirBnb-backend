package com.project.airBnb.dto;

import com.project.airBnb.entity.HotelContactInfo;
import lombok.Data;

@Data
public class HotelDto {
    private Long id;
    private String name;
    private String city;
    private String[] photos; //it will store url of images in array form
    private String[] amenities; //it will store-> {"wifi","swimming pool",etc}
    private HotelContactInfo contactInfo;
    private Boolean active;
}
