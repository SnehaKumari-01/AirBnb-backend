package com.project.airBnb.controller;

import com.project.airBnb.service.BookingService;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/webhook")
@RequiredArgsConstructor
@Slf4j
public class WebhookController {

    private final BookingService bookingService;

    @Value("${razorpay.webhook.secret}")
    private String webhookSecret;

    @PostMapping("/payment")
    public ResponseEntity<Void> handlePaymentWebhook(
            @RequestBody String payload,
            @RequestHeader("X-Razorpay-Signature") String razorpaySignature) {

        log.info("Received Razorpay webhook");

        try {
            // Step 1: Verify signature
//            boolean isValid = Utils.verifyWebhookSignature(payload, razorpaySignature, webhookSecret);
//            if (!isValid) {
//                log.error("Invalid Razorpay webhook signature");
//                return ResponseEntity.badRequest().build();
//            }

            // Step 2: Parse payload
            JSONObject jsonPayload = new JSONObject(payload);
            String event = jsonPayload.getString("event");
            log.info("Razorpay event received: {}", event);

            // Step 3: Handle payment.captured event
            if ("payment.captured".equals(event)) {
                JSONObject paymentEntity = jsonPayload
                        .getJSONObject("payload")
                        .getJSONObject("payment")
                        .getJSONObject("entity");

                String razorpayOrderId = paymentEntity.getString("order_id");
                String razorpayPaymentId = paymentEntity.getString("id");
                Long amount = paymentEntity.getLong("amount");

                // Step 4: Delegate to service
                bookingService.capturePayment(razorpayOrderId, razorpayPaymentId, amount);
            }

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Error processing Razorpay webhook: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}