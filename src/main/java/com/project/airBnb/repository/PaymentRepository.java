package com.project.airBnb.repository;

import com.project.airBnb.entity.Booking;
import com.project.airBnb.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
    Optional<Payment> findByBooking(Booking booking);
}
