package com.project.airBnb.repository;

import com.project.airBnb.entity.Booking;
import com.project.airBnb.entity.Hotel;
import com.project.airBnb.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository <Booking,Long> {
    Optional<Booking> findByPaymentSessionId(String paymentSessionId);

    List<Booking> findByHotel(Hotel hotel);

    List<Booking> findByHotelAndCreatedAtBetween(Hotel hotel, LocalDateTime startDateTime, LocalDateTime endDateTime);

    List<Booking> findByUser(User user);
}
