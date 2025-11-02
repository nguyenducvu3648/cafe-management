# 📢 HƯỚNG DẪN THUYẾT TRÌNH BACKEND

## ⏱️ PHÂN BỔ THỜI GIAN (10-15 phút)

| Phần | Thời gian | Nội dung |
|------|-----------|----------|
| 1. Giới thiệu | 1-2 phút | Tổng quan hệ thống |
| 2. Demo live | 2-3 phút | Show hệ thống chạy |
| 3. Architecture | 3-4 phút | Kiến trúc, luồng xử lý |
| 4. Security | 2-3 phút | JWT, authentication, authorization |
| 5. Database | 1-2 phút | Relationships, entities |
| 6. Kết luận | 1 phút | Tổng kết, Q&A |

---

## 🎯 CÁCH THUYẾT TRÌNH TỪNG PHẦN

### 1️⃣ GIỚI THIỆU (1-2 phút)

**Nói gì:**
```
"Chào mọi người, hôm nay em sẽ trình bày về phần Backend của hệ thống 
Cafe Management. Đây là một ứng dụng quản lý quán cafe với 2 vai trò chính:
- Customer: xem menu, đặt hàng, theo dõi đơn hàng
- Admin: quản lý sản phẩm, bàn, đơn hàng và xem thống kê

Em sử dụng Spring Boot 3.2 với Java 20, MySQL làm database, 
và JWT cho authentication."
```

**Show:**
- Slide overview
- Tech stack

---

### 2️⃣ DEMO LIVE (2-3 phút)

**Làm gì:**
1. **Mở Postman/Thunder Client** hoặc cho xem Frontend
2. **Demo Register/Login:**
   ```
   "Đầu tiên là phần Authentication. Em sẽ đăng ký một user mới..."
   ```
   - POST /api/auth/register → Show response
   - POST /api/auth/login → Show JWT token

3. **Demo xem Products:**
   ```
   "Tiếp theo, user có thể xem menu mà không cần đăng nhập..."
   ```
   - GET /api/products → Show danh sách sản phẩm

4. **Demo đặt hàng:**
   ```
   "Bây giờ em sẽ demo đặt hàng. Em sẽ chọn bàn 5 và thêm một số món..."
   ```
   - POST /api/orders với Bearer token → Show response

5. **Demo Admin:**
   ```
   "Với vai trò Admin, em có thể xem tất cả đơn hàng và thống kê..."
   ```
   - Login với admin
   - GET /api/admin/orders
   - GET /api/admin/statistics

**Tips:**
- Nói rõ ràng từng bước
- Show request/response
- Highlight JWT token trong header

---

### 3️⃣ ARCHITECTURE (3-4 phút)

**Nói gì:**
```
"Hệ thống em sử dụng kiến trúc Layered (3 tầng):
- Controller: Nhận request từ client
- Service: Xử lý business logic
- Repository: Giao tiếp với database"
```

**Show code:**

#### Slide/Cursor: Cấu trúc thư mục
```
┌─────────────────────┐
│   Controller Layer  │ ← API endpoints
├─────────────────────┤
│   Service Layer     │ ← Business logic
├─────────────────────┤
│   Repository Layer  │ ← Data access
├─────────────────────┤
│   Entities          │ ← Database models
└─────────────────────┘
```

#### Show code: OrderController
```java
@PostMapping
public ResponseEntity<?> createOrder(
    @RequestHeader("Authorization") String authHeader,
    @RequestBody CreateOrderRequest request) {
    
    String token = authHeader.substring(7);
    Long userId = jwtUtil.extractUserId(token);
    
    OrderResponse response = orderService.createOrder(userId, request);
    return ResponseEntity.ok(response);
}
```

**Giải thích:**
```
"Ở Controller, em nhận request, extract userId từ JWT token,
rồi gọi service để xử lý business logic..."
```

#### Show code: OrderService.createOrder()
```java
@Transactional
public OrderResponse createOrder(Long userId, CreateOrderRequest request) {
    // Validate
    User user = userRepository.findById(userId).orElseThrow(...);
    CafeTable table = tableRepository.findById(request.getTableId())...
    
    // Create order
    Order order = new Order();
    order.setUser(user);
    order.setTable(table);
    
    // Calculate total
    double totalPrice = 0;
    for (OrderItemRequest itemReq : request.getItems()) {
        Product product = productRepository.findById(...);
        totalPrice += product.getPrice() * itemReq.getQuantity();
    }
    
    return mapToOrderResponse(orderRepository.save(order));
}
```

**Giải thích:**
```
"Ở Service, em validate dữ liệu, tạo order, tính tổng tiền,
và lưu vào database thông qua repository.
@Transactional đảm bảo tất cả thao tác hoặc thành công hết hoặc rollback hết."
```

#### Show luồng xử lý:
```
Request → Controller → Service → Repository → Database
         ↓            ↓          ↓            ↓
   Extract JWT   Business    JPA/Hibernate  MySQL
                Logic          ORM
```

---

### 4️⃣ SECURITY (2-3 phút)

**Nói gì:**
```
"Về phần bảo mật, em implement 3 lớp:
1. Password Encryption với BCrypt
2. JWT Authentication
3. Role-based Authorization"
```

#### Show SecurityConfig
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) {
    http.authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/auth/**").permitAll()
        .requestMatchers("/api/admin/**").hasRole("ADMIN")
        .anyRequest().authenticated()
    )
    .addFilterBefore(jwtAuthenticationFilter, 
                     UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

**Giải thích:**
```
"Các endpoint /api/auth là public, /api/admin yêu cầu role ADMIN,
còn lại phải authenticated. JWT Filter sẽ intercept mọi request
để validate token."
```

#### Show JwtAuthenticationFilter
```java
protected void doFilterInternal(...) {
    String authHeader = request.getHeader("Authorization");
    
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7);
        
        if (jwtUtil.validateToken(token)) {
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);
            
            UsernamePasswordAuthenticationToken auth = 
                new UsernamePasswordAuthenticationToken(
                    username, null, 
                    List.of(new SimpleGrantedAuthority("ROLE_" + role))
                );
            
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
    }
    
    filterChain.doFilter(request, response);
}
```

**Giải thích:**
```
"Filter này lấy JWT token từ header, validate token,
extract user info và set vào SecurityContext để Spring Security
biết user hiện tại là ai và có role gì."
```

#### Show CORS config
```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:3000",
    "http://localhost:5173"
));
configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
configuration.setAllowCredentials(true);
```

**Giải thích:**
```
"Em cũng cấu hình CORS để cho phép Frontend ở các port khác nhau
gọi API mà không bị chặn bởi browser."
```

---

### 5️⃣ DATABASE (1-2 phút)

**Show ERD:**
```
┌─────────────┐         ┌─────────────┐
│    User     │────────<│    Order    │
│ 1        N  │         │    N     N  │
└─────────────┘         └───────┬─────┘
                                │
                        ┌───────▼─────────┐
                        │  OrderItem      │
                        │    N        1   │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │    Product      │
                        └─────────────────┘
```

**Giải thích:**
```
"Database có 5 bảng chính:
- Users: thông tin người dùng
- Products: menu các món
- Orders: đơn hàng
- OrderItems: chi tiết từng món trong đơn
- Tables: bàn

Relation: 1 User có N Orders, 1 Order có N OrderItems,
1 OrderItem thuộc về 1 Product."
```

**Show Entity:**
```java
@Entity
public class Order {
    @ManyToOne
    private User user;
    
    @ManyToOne
    private CafeTable table;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
}
```

**Giải thích:**
```
"Em sử dụng JPA annotations để định nghĩa relationships.
@ManyToOne, @OneToMany giúp JPA tự động map với foreign keys
trong database."
```

---

### 6️⃣ KẾT LUẬN (1 phút)

**Tổng kết:**
```
"Vậy là em đã trình bày xong phần Backend của hệ thống Cafe Management.
Tóm lại:

1. Kiến trúc: Layered Architecture với Controller-Service-Repository
2. Security: JWT Authentication + Role-based Authorization
3. Database: JPA/Hibernate ORM với MySQL
4. API: RESTful design, clean code, error handling

Cảm ơn mọi người đã lắng nghe. Em mời các câu hỏi."
```

**Highlight điểm mạnh:**
- ✅ Security tốt
- ✅ Code clean, dễ maintain
- ✅ Scalable
- ✅ Docker-ready

---

## 🎤 TIPS THUYẾT TRÌNH

### Do's ✅
- **Nói chậm, rõ ràng**: Đừng nói quá nhanh
- **Show code thực tế**: Dùng code editor hoặc slides
- **Demo live**: Postman hoặc Frontend
- **Giải thích luồng**: Từ request đến response
- **Tự tin**: Bạn làm được rồi mà!
- **Ngôn ngữ tự nhiên**: Nói như giải thích cho bạn

### Don'ts ❌
- **Đừng đọc code**: Giải thích logic, không đọc từng dòng
- **Đừng quá kỹ thuật**: Nếu giám khảo không biết JWT, giải thích đơn giản
- **Đừng lặp lại**: Mỗi ý nói 1 lần, không nhắc đi nhắc lại
- **Đừng chém gió**: Thành thật về những gì bạn biết

---

## 💡 CÂU HỎI THƯỜNG GẶP

### Q: "Tại sao dùng JWT thay vì Session?"
**A:** JWT là stateless, không cần lưu session trong server. Dễ scale horizontal và phù hợp cho REST API.

### Q: "Spring Boot khác gì Spring Framework?"
**A:** Spring Boot là extension của Spring, có auto-configuration, embedded server, nên setup nhanh hơn.

### Q: "Làm sao xử lý concurrent requests?"
**A:** Spring Boot mặc định dùng thread pool, mỗi request chạy trong 1 thread riêng. Có thể tối ưu bằng connection pooling.

### Q: "Làm sao đảm bảo data consistency?"
**A:** Dùng `@Transactional` để tất cả thao tác hoặc commit hết hoặc rollback hết.

### Q: "Có thể deploy production như thế nào?"
**A:** Em đã có Docker setup, có thể deploy lên cloud (AWS, GCP, Azure) hoặc VPS. Backend chạy trên port 8080, cần reverse proxy (Nginx).

---

## 📦 CHUẨN BỊ TRƯỚC KHI THUYẾT TRÌNH

- [ ] Backend chạy OK
- [ ] Database có data mẫu
- [ ] Postman/Thunder Client setup sẵn
- [ ] Code editor mở sẵn
- [ ] BACKEND_PRESENTATION.md đã đọc
- [ ] Demo flow đã test trước
- [ ] Slides (nếu có)

---

## 🚀 CHÚC BẠN THÀNH CÔNG!

Nhớ: **Bình tĩnh, tự tin, giải thích rõ ràng!**

Bạn làm được! 💪🎯

