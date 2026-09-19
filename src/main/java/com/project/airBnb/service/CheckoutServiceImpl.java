package com.project.airBnb.service;

import com.project.airBnb.entity.Booking;
import com.project.airBnb.entity.User;
import com.project.airBnb.repository.BookingRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutServiceImpl implements CheckoutService {

    private final BookingRepository bookingRepository;
    private final RazorpayClient razorpayClient;

    @Override
    public String getCheckoutSession(Booking booking, String successUrl, String failureUrl) {
        log.info("Creating Razorpay order for booking with ID: {}", booking.getId());

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", booking.getAmount()
                    .multiply(BigDecimal.valueOf(100)).longValue()); // amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "booking_" + booking.getId());

            JSONObject notes = new JSONObject();
            notes.put("bookingId", booking.getId().toString());
            notes.put("hotelName", booking.getHotel().getName());
            notes.put("roomType", booking.getRoom().getType());
            notes.put("customerName", user.getName());
            notes.put("customerEmail", user.getEmail());
            orderRequest.put("notes", notes);

            Order order = razorpayClient.orders.create(orderRequest);

            booking.setPaymentSessionId(order.get("id"));
            bookingRepository.save(booking);

            log.info("Razorpay order created successfully with ID: {}", order.get("id").toString());
            return order.get("id");

        } catch (RazorpayException e) {
            throw new RuntimeException("Razorpay error: " + e.getMessage(), e);
        }
    }
}