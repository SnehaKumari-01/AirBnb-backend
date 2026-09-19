package com.project.airBnb.service;
import com.project.airBnb.dto.BookingDto;
import com.project.airBnb.dto.BookingRequest;
import com.project.airBnb.dto.GuestDto;
import com.project.airBnb.dto.HotelReportDto;
import com.project.airBnb.entity.*;
import com.project.airBnb.entity.enums.BookingStatus;
import com.project.airBnb.entity.enums.PaymentStatus;
import com.project.airBnb.exception.ResourceNotFoundException;
import com.project.airBnb.exception.UnAuthorisedException;
import com.project.airBnb.repository.*;


import com.project.airBnb.strategy.PricingService;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import org.springframework.security.access.AccessDeniedException;

import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import static com.project.airBnb.util.AppUtil.getCurrentUser;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService{
    private final GuestRepository guestRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final HotelRepository hotelRepository;
    private final InventoryRepository inventoryRepository;
    private final ModelMapper modelMapper;
    private final CheckoutService checkoutService;
    private final PaymentRepository paymentRepository;
    private final RazorpayClient razorpayClient;
    private final PricingService pricingService;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    @Transactional
    public BookingDto initialiseBooking(BookingRequest bookingRequest) {
        log.info("Initialising booking for hotel : {}, room: {}, date {}-{}",bookingRequest.getHotelId(),
                bookingRequest.getRoomId(),bookingRequest.getCheckInDate(),bookingRequest.getCheckOutDate());

        Hotel hotel=hotelRepository.findById(bookingRequest.getHotelId())
                .orElseThrow(()->new ResourceNotFoundException("Hotel not found with id:"+bookingRequest.getHotelId()));

        Room room = roomRepository.findById(bookingRequest.getRoomId())
                .orElseThrow(()->new ResourceNotFoundException("Rooms not found with id:"+bookingRequest.getRoomId()));

        List<Inventory> inventoryList=inventoryRepository.findAndLockAvailableInventory(room.getId(),
                bookingRequest.getCheckInDate(),bookingRequest.getCheckOutDate(), Math.toIntExact(bookingRequest.getRoomsCount()));

        long daysCount= ChronoUnit.DAYS.between(bookingRequest.getCheckInDate(),bookingRequest.getCheckOutDate())+1;

        if(inventoryList.size()!=daysCount){
            throw new IllegalStateException("Room is not available anymore");
        }
        //RESERVE THE ROOM/ UPDATE THE BOOKED COUNT OF INVENTORIES
//        for(Inventory inventory:inventoryList){
//            inventory.setReservedCount(inventory.getReservedCount()+bookingRequest.getRoomsCount());
//        }
//        inventoryRepository.saveAll(inventoryList);

        inventoryRepository.initBooking(room.getId(),bookingRequest.getCheckInDate(),bookingRequest.getCheckOutDate(),bookingRequest.getRoomsCount());

        //create the booking

//        User user=new User();
//        user.setId(1L); //TODO: REMOVE DUMMY USER

        //TODO: CALCULATE DYNAMIC PRICE

        BigDecimal priceForOneRoom = pricingService.calculateTotalPrice(inventoryList);
        BigDecimal totalPrice=priceForOneRoom.multiply(BigDecimal.valueOf(bookingRequest.getRoomsCount()));
        Booking booking = Booking.builder()
                .bookingStatus(BookingStatus.RESERVED)
                .hotel(hotel)
                .room(room)
                .checkInDate(bookingRequest.getCheckInDate())
                .checkOutDate(bookingRequest.getCheckOutDate())
                .user(getCurrentUser())
                .roomsCount(bookingRequest.getRoomsCount())
                .amount(totalPrice)
                .build();
        booking=bookingRepository.save(booking);
        return modelMapper.map(booking, BookingDto.class);
    }

    @Override
    public BookingDto addGuests(Long bookingId, List<GuestDto> guestDtoList) {
        log.info("Adding guests for booking with id: {}",bookingId);
      Booking booking=bookingRepository.findById(bookingId)
                .orElseThrow(()->new ResourceNotFoundException("Booking not found with id:"+bookingId));
      User user=getCurrentUser();
      if(!user.equals(booking.getUser())){
          throw new UnAuthorisedException("Booking doesn't belong to this user with id: "+user.getId());
      }

      if(hasBookingExpired(booking)){
          throw new IllegalStateException("Booking has already expired");
      }

      if(booking.getBookingStatus()!=BookingStatus.RESERVED){
          throw new IllegalStateException("Booking is not under reserved state, cannot add guests");
      }
//go to each guest and put these guest in the booking
      for(GuestDto guestDto:guestDtoList){
          Guest guest = modelMapper.map(guestDto,Guest.class);
          guest.setUser(user);
          guest= guestRepository.save(guest);
          booking.getGuests().add(guest);
      }
      booking.setBookingStatus(BookingStatus.GUEST_ADDED);
      booking=bookingRepository.save(booking);
      return modelMapper.map(booking,BookingDto.class);

    }

    @Override
    public String initiatePayment(Long bookingId) {
        Booking booking=bookingRepository.findById(bookingId).orElseThrow(()
        ->new ResourceNotFoundException("Booking not found with id: "+bookingId));
        User user=getCurrentUser();
        if(!user.equals(booking.getUser())){
            throw new UnAuthorisedException("Booking doesn't belong to this user with id: "+user.getId());
        }

        if(hasBookingExpired(booking)){
            throw new IllegalStateException("Booking has already expired");
        }

        String sessionUrl=checkoutService.getCheckoutSession(booking,frontendUrl+"payments/success",frontendUrl+"payment/failure");
        booking.setBookingStatus(BookingStatus.PAYMENT_PENDING);
        bookingRepository.save(booking);
    return sessionUrl;
    }
//    @Override
//    @Transactional
//    public void capturePayment(String razorpayOrderId, String razorpayPaymentId, Long amount) {
//        log.info("Capturing payment for Razorpay order: {}", razorpayOrderId);
//
//        Booking booking = bookingRepository.findByPaymentSessionId(razorpayOrderId)
//                .orElseThrow(() -> new ResourceNotFoundException(
//                        "Booking not found for order: " + razorpayOrderId));
//
//        // Update booking status
//        booking.setBookingStatus(BookingStatus.CONFIRMED);
//        bookingRepository.save(booking);
//
//        // Update inventory - move rooms from RESERVED → BOOKED
//        List<Inventory> inventoryList = inventoryRepository.findAndLockReservedInventory(
//                booking.getRoom().getId(),
//                booking.getCheckInDate(),
//                booking.getCheckOutDate(),
//                booking.getRoomsCount()
//        );
//        for (Inventory inventory : inventoryList) {
//            inventory.setBookedCount(inventory.getBookedCount() + booking.getRoomsCount());
//            inventory.setReservedCount(inventory.getReservedCount() - booking.getRoomsCount());
//        }
//        inventoryRepository.saveAll(inventoryList);
//
//        // Save payment record
//        Payment payment = new Payment();
//        payment.setTransactionId(razorpayPaymentId);
//        payment.setPaymentStatus(PaymentStatus.CONFIRMED);
//        payment.setAmount(BigDecimal.valueOf(amount / 100.0));
//        payment.setBooking(booking);
//        paymentRepository.save(payment);
//
//        log.info("Payment captured successfully for booking: {}", booking.getId());
//    }
@Override
@Transactional
public void capturePayment(String razorpayOrderId, String razorpayPaymentId, Long amount) {
    log.info("Capturing payment for Razorpay order: {}", razorpayOrderId);

    Booking booking = bookingRepository.findByPaymentSessionId(razorpayOrderId)
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Booking not found for order: " + razorpayOrderId));

    booking.setBookingStatus(BookingStatus.CONFIRMED);
    bookingRepository.save(booking);

    // ✅ Use confirmBooking directly
    inventoryRepository.confirmBooking(
            booking.getRoom().getId(),
            booking.getCheckInDate(),
            booking.getCheckOutDate(),
            booking.getRoomsCount()
    );

    Payment payment = new Payment();
    payment.setTransactionId(razorpayPaymentId);
    payment.setPaymentStatus(PaymentStatus.CONFIRMED);
    payment.setAmount(BigDecimal.valueOf(amount / 100.0));
    payment.setBooking(booking);
    paymentRepository.save(payment);

    log.info("Payment captured successfully for booking: {}", booking.getId());
}

    @Override
    @Transactional
    public void cancelBooking(Long bookingId) {
        log.info("Cancelling booking with id: {}", bookingId);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));

        User user = getCurrentUser();
        if (!user.equals(booking.getUser())) {
            throw new UnAuthorisedException(
                    "Booking does not belong to this user with id: " + user.getId());
        }

        if (booking.getBookingStatus().equals(BookingStatus.CANCELLED)) {
            throw new IllegalStateException("Booking is already cancelled");
        }

        // Handle refund if payment was made
        if (booking.getBookingStatus().equals(BookingStatus.CONFIRMED)) {
            // Get payment record to get Razorpay payment ID
            Payment payment = paymentRepository.findByBooking(booking)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Payment not found for booking: " + bookingId));

            try {
                // Initiate Razorpay refund
                JSONObject refundRequest = new JSONObject();
                refundRequest.put("amount",
                        payment.getAmount().multiply(BigDecimal.valueOf(100)).longValue()); // paise
                razorpayClient.payments.refund(payment.getTransactionId(), refundRequest);

                // Update payment status
                payment.setPaymentStatus(PaymentStatus.CANCELLED);
                paymentRepository.save(payment);

                // Update inventory - reduce bookedCount
                inventoryRepository.cancelBooking(
                        booking.getRoom().getId(),
                        booking.getCheckInDate(),
                        booking.getCheckOutDate(),
                        booking.getRoomsCount()
                );

            } catch (RazorpayException e) {
                throw new RuntimeException("Razorpay refund failed: " + e.getMessage(), e);
            }

        } else {
            // Payment not done yet — just release reserved inventory
            inventoryRepository.cancelBooking(
                    booking.getRoom().getId(),
                    booking.getCheckInDate(),
                    booking.getCheckOutDate(),
                    booking.getRoomsCount()
            );
        }

        // Update booking status
        booking.setBookingStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        log.info("Booking cancelled successfully with id: {}", bookingId);
    }

    @Override
    public String getBookingStatus(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Booking not found with id: " + bookingId));

        User user = getCurrentUser();
        if (!user.equals(booking.getUser())) {
            throw new UnAuthorisedException(
                    "Booking does not belong to this user with id: " + user.getId());
        }
        return booking.getBookingStatus().name();
    }

    @Override
    public List<BookingDto> getAllBookingByHotelId(Long hotelId) {
        Hotel hotel= hotelRepository.findById(hotelId).orElseThrow(()->new ResourceNotFoundException("Hotel not found with ID: "+hotelId));
        User user=getCurrentUser();
        if(!user.equals(hotel.getOwner())) throw new AccessDeniedException("You are not the owner of hotel with ID: "+hotelId);

        List<Booking> bookings=bookingRepository.findByHotel(hotel);

        return bookings.stream().map((element)->modelMapper.map(element, BookingDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public HotelReportDto getHotelReport(Long hotelId, LocalDate startDate, LocalDate endDate) {
        Hotel hotel= hotelRepository.findById(hotelId).orElseThrow(()->new ResourceNotFoundException("Hotel not found with ID: "+hotelId));
        User user=getCurrentUser();
        log.info("Generating report for hotel with ID: {}",hotelId);
        if(!user.equals(hotel.getOwner())) throw new AccessDeniedException("You are not the owner of hotel with ID: "+hotelId);

        LocalDateTime startDateTime=startDate.atStartOfDay();
        LocalDateTime endDateTime=endDate.atTime(LocalTime.MAX);

        List<Booking> bookings=bookingRepository.findByHotelAndCreatedAtBetween(hotel, startDateTime, endDateTime);

        Long totalConfirmBookings=bookings.stream().filter(booking -> booking.getBookingStatus()==BookingStatus.CONFIRMED)
                .count();

        BigDecimal totalRevenueOfConfirmedBookings=bookings.stream()
                .filter(booking -> booking.getBookingStatus()==BookingStatus.CONFIRMED)
                .map(Booking::getAmount)
                .reduce(BigDecimal.ZERO,BigDecimal::add);

        BigDecimal avgRevenue=totalConfirmBookings== 0? BigDecimal.ZERO : totalRevenueOfConfirmedBookings
                .divide(BigDecimal.valueOf(totalConfirmBookings), RoundingMode.HALF_UP);
        return new HotelReportDto(totalConfirmBookings,totalRevenueOfConfirmedBookings,avgRevenue);
    }

    @Override
    public List<BookingDto> getMyBookings() {
        User user = getCurrentUser();
        return bookingRepository.findByUser(user)
                .stream().map((element)-> modelMapper.map(element,BookingDto.class))
                .collect(Collectors.toList());
    }

    public boolean hasBookingExpired(Booking booking){
        return booking.getCreatedAt().plusMinutes(10).isBefore(LocalDateTime.now());
    }



}
