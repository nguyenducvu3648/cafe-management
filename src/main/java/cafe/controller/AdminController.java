package cafe.controller;

import cafe.dto.OrderResponse;
import cafe.dto.StatisticsResponse;
import cafe.entity.CafeTable;
import cafe.entity.Order;
import cafe.entity.Product;
import cafe.service.OrderService;
import cafe.service.ProductService;
import cafe.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final ProductService productService;
    private final TableService tableService;
    private final OrderService orderService;
    
    // ========== Product Management ==========
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.createProduct(product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, product));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok("Đã xóa món thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PatchMapping("/products/{id}/toggle")
    public ResponseEntity<?> toggleProductAvailability(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.toggleAvailability(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // ========== Table Management ==========
    @PostMapping("/tables")
    public ResponseEntity<?> createTable(@RequestBody CafeTable table) {
        try {
            return ResponseEntity.ok(tableService.createTable(table));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/tables/{id}")
    public ResponseEntity<?> updateTable(@PathVariable Long id, @RequestBody CafeTable table) {
        try {
            return ResponseEntity.ok(tableService.updateTable(id, table));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/tables/{id}")
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        try {
            tableService.deleteTable(id);
            return ResponseEntity.ok("Đã xóa bàn thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PatchMapping("/tables/{id}/status")
    public ResponseEntity<?> updateTableStatus(@PathVariable Long id, 
                                               @RequestBody Map<String, String> request) {
        try {
            CafeTable.Status status = CafeTable.Status.valueOf(request.get("status"));
            return ResponseEntity.ok(tableService.updateTableStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // ========== Order Management ==========
    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id,
                                               @RequestBody Map<String, String> request) {
        try {
            Order.Status status = Order.Status.valueOf(request.get("status"));
            return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // ========== Statistics ==========
    @GetMapping("/statistics")
    public ResponseEntity<StatisticsResponse> getStatistics() {
        return ResponseEntity.ok(orderService.getTodayStatistics());
    }
}