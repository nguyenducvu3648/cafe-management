package cafe.controller;

import cafe.dto.CreateOrderRequest;
import cafe.dto.OrderResponse;
import cafe.security.JwtUtil;
import cafe.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    private final JwtUtil jwtUtil;
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestHeader("Authorization") String authHeader,
                                        @RequestBody CreateOrderRequest request) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            
            OrderResponse response = orderService.createOrder(userId, request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            
            List<OrderResponse> orders = orderService.getUserOrders(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelOrder(@RequestHeader("Authorization") String authHeader,
                                        @PathVariable Long id) {
        try {
            String token = authHeader.substring(7);
            Long userId = jwtUtil.extractUserId(token);
            
            orderService.cancelOrder(id, userId);
            return ResponseEntity.ok("Đã hủy đơn hàng thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}