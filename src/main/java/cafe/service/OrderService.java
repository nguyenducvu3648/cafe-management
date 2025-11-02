package cafe.service;

import cafe.dto.*;
import cafe.entity.*;
import cafe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final TableRepository tableRepository;
    private final ProductRepository productRepository;
    
    @Transactional
    public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        
        CafeTable table = tableRepository.findById(request.getTableId())
            .orElseThrow(() -> new RuntimeException("Bàn không tồn tại"));
        
        if (table.getStatus() != CafeTable.Status.AVAILABLE) {
            throw new RuntimeException("Bàn đã được đặt hoặc đang có khách");
        }
        
        Order order = new Order();
        order.setUser(user);
        order.setTable(table);
        order.setNote(request.getNote());
        order.setStatus(Order.Status.PENDING);
        
        double totalPrice = 0;
        
        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                .orElseThrow(() -> new RuntimeException("Món không tồn tại"));
            
            if (!product.getAvailable()) {
                throw new RuntimeException("Món " + product.getName() + " hiện không có sẵn");
            }
            
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemReq.getQuantity());
            item.setPrice(product.getPrice());
            item.setNote(itemReq.getNote());
            
            order.getItems().add(item);
            totalPrice += product.getPrice() * itemReq.getQuantity();
        }
        
        order.setTotalPrice(totalPrice);
        order = orderRepository.save(order);
        
        // Cập nhật trạng thái bàn
        table.setStatus(CafeTable.Status.RESERVED);
        tableRepository.save(table);
        
        return mapToOrderResponse(order);
    }
    
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
            .map(this::mapToOrderResponse)
            .collect(Collectors.toList());
    }
    
    public List<OrderResponse> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId).stream()
            .map(this::mapToOrderResponse)
            .collect(Collectors.toList());
    }
    
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        return mapToOrderResponse(order);
    }
    
    @Transactional
    public OrderResponse updateOrderStatus(Long id, Order.Status status) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        
        order.setStatus(status);
        
        if (status == Order.Status.CONFIRMED) {
            order.getTable().setStatus(CafeTable.Status.OCCUPIED);
        } else if (status == Order.Status.COMPLETED) {
            order.setCompletedAt(LocalDateTime.now());
            order.getTable().setStatus(CafeTable.Status.CLEANING);
        } else if (status == Order.Status.CANCELLED) {
            order.getTable().setStatus(CafeTable.Status.AVAILABLE);
        }
        
        order = orderRepository.save(order);
        return mapToOrderResponse(order);
    }
    
    @Transactional
    public void cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));
        
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền hủy đơn này");
        }
        
        if (order.getStatus() != Order.Status.PENDING) {
            throw new RuntimeException("Chỉ có thể hủy đơn đang chờ xác nhận");
        }
        
        order.setStatus(Order.Status.CANCELLED);
        order.getTable().setStatus(CafeTable.Status.AVAILABLE);
        orderRepository.save(order);
    }
    
    public StatisticsResponse getTodayStatistics() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        
        List<Order> todayOrders = orderRepository.findByCreatedAtBetween(startOfDay, endOfDay);
        
        long totalOrders = todayOrders.size();
        long completedOrders = todayOrders.stream()
            .filter(o -> o.getStatus() == Order.Status.COMPLETED)
            .count();
        long pendingOrders = todayOrders.stream()
            .filter(o -> o.getStatus() == Order.Status.PENDING)
            .count();
        
        Double totalRevenue = orderRepository.getTotalRevenueBetween(startOfDay, endOfDay);
        if (totalRevenue == null) totalRevenue = 0.0;
        
        long totalCustomers = todayOrders.stream()
            .map(o -> o.getUser().getId())
            .distinct()
            .count();
        
        long availableTables = tableRepository.findByStatus(CafeTable.Status.AVAILABLE).size();
        
        return new StatisticsResponse(
            totalOrders,
            completedOrders,
            pendingOrders,
            totalRevenue,
            totalCustomers,
            availableTables
        );
    }
    
    private OrderResponse mapToOrderResponse(Order order) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        List<OrderItemResponse> items = order.getItems().stream()
            .map(item -> new OrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getQuantity(),
                item.getPrice(),
                item.getNote()
            ))
            .collect(Collectors.toList());
        
        return new OrderResponse(
            order.getId(),
            order.getUser().getId(),
            order.getUser().getFullName(),
            order.getTable().getId(),
            order.getTable().getTableNumber(),
            items,
            order.getTotalPrice(),
            order.getStatus(),
            order.getCreatedAt().format(formatter),
            order.getCompletedAt() != null ? order.getCompletedAt().format(formatter) : null,
            order.getNote()
        );
    }
}