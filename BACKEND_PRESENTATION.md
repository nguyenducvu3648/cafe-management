# 🎯 CAFE MANAGEMENT SYSTEM - BACKEND ARCHITECTURE & FLOW

## 📋 MỤC LỤC THUYẾT TRÌNH

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Kiến trúc Backend](#2-kiến-trúc-backend)
3. [Công nghệ sử dụng](#3-công-nghệ-sử-dụng)
4. [Luồng xử lý chính](#4-luồng-xử-lý-chính)
5. [Chi tiết các module](#5-chi-tiết-các-module)
6. [Demo các tính năng](#6-demo-các-tính-năng)

---

## 1. TỔNG QUAN HỆ THỐNG

### 🎯 Mục đích
Hệ thống quản lý quán cafe với 2 vai trò:
- **CUSTOMER**: Xem menu, đặt hàng, theo dõi đơn hàng
- **ADMIN**: Quản lý sản phẩm, bàn, đơn hàng, thống kê

### 🏗️ Kiến trúc tổng thể
```
Frontend (React + Vite)  →  Backend (Spring Boot)  →  Database (MySQL)
    Port 3000                    Port 8080              Port 3306
```

---

## 2. KIẾN TRÚC BACKEND

### 📂 Cấu trúc thư mục (Layered Architecture)

```
cafe/
├── entity/          → Database Models
├── repository/      → Data Access Layer
├── service/         → Business Logic Layer
├── controller/      → API Endpoints
├── dto/             → Data Transfer Objects
├── security/        → Authentication & Authorization
└── config/          → Configuration
```

### 🔄 Luồng xử lý request

```
Client Request
    ↓
Controller (Nhận request)
    ↓
Service (Xử lý business logic)
    ↓
Repository (Truy vấn database)
    ↓
Database (MySQL)
    ↓
Response về Client
```

---

## 3. CÔNG NGHỆ SỬ DỤNG

### 🛠️ Core Technologies

| Technology | Version | Mục đích |
|------------|---------|----------|
| **Spring Boot** | 3.2.0 | Framework backend chính |
| **Java** | 20 | Ngôn ngữ lập trình |
| **MySQL** | 8.0 | Database |
| **JWT** | 0.12.3 | Authentication |
| **Spring Security** | - | Authorization |
| **Spring Data JPA** | - | ORM - Quản lý database |
| **Lombok** | 1.18.42 | Giảm boilerplate code |
| **Maven** | 3.9 | Build tool |

### 🔐 Security

- **BCrypt Password Encoder**: Mã hóa mật khẩu
- **JWT Token**: Stateless authentication
- **Role-based Access Control**: ADMIN vs USER
- **CORS Configuration**: Cho phép frontend connect

---

## 4. LUỒNG XỬ LÝ CHÍNH

### 🔐 4.1. Authentication Flow (Đăng nhập/Đăng ký)

#### Đăng ký (Register)
```
Client: POST /api/auth/register
    ↓
Controller: AuthController.register()
    ↓
Service: AuthService.register()
    ├─ Kiểm tra username đã tồn tại?
    ├─ Mã hóa password bằng BCrypt
    ├─ Lưu User vào database
    └─ Tạo JWT Token
    ↓
Response: { token, user: { id, username, role } }
```

#### Đăng nhập (Login)
```
Client: POST /api/auth/login
    ↓
Controller: AuthController.login()
    ↓
Service: AuthService.login()
    ├─ Kiểm tra username tồn tại?
    ├─ Kiểm tra password đúng không?
    └─ Tạo JWT Token
    ↓
Response: { token, user: { id, username, role } }
```

#### JWT Authentication Filter
```
Mọi request đến API
    ↓
JwtAuthenticationFilter.doFilterInternal()
    ├─ Kiểm tra header "Authorization: Bearer <token>"
    ├─ Validate token
    ├─ Extract username & role
    └─ Set authentication vào SecurityContext
    ↓
Controller xử lý
```

### 📦 4.2. Product Flow (Quản lý sản phẩm)

#### Customer xem menu
```
Client: GET /api/products
    ↓
ProductController.getAllProducts()
    ↓
ProductService.getAllProducts()
    ↓
ProductRepository.findAll()
    ↓
Response: [ { id, name, price, category, ... } ]
```

#### Admin tạo/sửa/xóa sản phẩm
```
Client: POST /api/admin/products (Cần role ADMIN)
    ↓
AdminController.createProduct()
    ↓
ProductService.createProduct()
    ↓
ProductRepository.save()
    ↓
Response: Product object
```

### 🛒 4.3. Order Flow (Quản lý đơn hàng)

#### Customer đặt hàng
```
Client: POST /api/orders
Headers: Authorization: Bearer <token>
Body: { tableId, items: [{ productId, quantity }], note }
    ↓
OrderController.createOrder()
    ├─ Extract userId từ JWT Token
    ↓
OrderService.createOrder(userId, request)
    ├─ Validate table available?
    ├─ Validate products exist & available?
    ├─ Calculate totalPrice
    ├─ Create Order + OrderItems
    ├─ Update table status to OCCUPIED
    └─ Save to database
    ↓
Response: OrderResponse { id, status, totalPrice, items, ... }
```

#### Admin xem & quản lý đơn hàng
```
Client: GET /api/admin/orders (Cần role ADMIN)
    ↓
AdminController.getAllOrders()
    ↓
OrderService.getAllOrders()
    ↓
Response: [ { id, user, table, status, totalPrice, ... } ]
```

#### Admin cập nhật trạng thái đơn
```
Client: PATCH /api/admin/orders/{id}/status
Body: { "status": "SERVING" }
    ↓
OrderService.updateOrderStatus()
    ├─ Update order status
    └─ Nếu COMPLETED: update completedAt, tính vào statistics
    ↓
Response: Updated OrderResponse
```

### 📊 4.4. Statistics Flow (Thống kê)

#### Admin xem thống kê
```
Client: GET /api/admin/statistics
    ↓
AdminController.getStatistics()
    ↓
OrderService.getTodayStatistics()
    ├─ Count: totalOrders, completedOrders
    ├─ Calculate: totalRevenue
    ├─ Count: pendingOrders, servingOrders
    └─ Query from database
    ↓
Response: { totalOrders, totalRevenue, ... }
```

---

## 5. CHI TIẾT CÁC MODULE

### 📁 5.1. Entities (Database Models)

#### User Entity
```java
@Entity
public class User {
    Long id;
    String username;        // Unique
    String password;        // Encrypted
    String fullName;
    String email;          // Unique
    Role role;             // ADMIN, USER
}
```

#### Product Entity
```java
@Entity
public class Product {
    Long id;
    String name;
    String description;
    Double price;
    String imageUrl;
    Category category;     // COFFEE, TEA, SMOOTHIE, JUICE, SNACK, DESSERT
    Boolean available;
}
```

#### Order Entity
```java
@Entity
public class Order {
    Long id;
    User user;             // ManyToOne
    CafeTable table;       // ManyToOne
    List<OrderItem> items; // OneToMany
    Double totalPrice;
    Status status;         // PENDING, CONFIRMED, SERVING, COMPLETED, CANCELLED
    LocalDateTime createdAt;
    LocalDateTime completedAt;
}
```

#### OrderItem Entity
```java
@Entity
public class OrderItem {
    Long id;
    Order order;           // ManyToOne
    Product product;       // ManyToOne
    Integer quantity;
    Double subtotal;
}
```

#### CafeTable Entity
```java
@Entity
public class CafeTable {
    Long id;
    Integer tableNumber;
    Integer capacity;
    Status status;         // AVAILABLE, OCCUPIED, RESERVED
}
```

### 🔒 5.2. Security Configuration

#### SecurityConfig.java
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    // Public endpoints (không cần auth)
    - /api/auth/**       → Allow all
    - /api/products/**   → Allow all
    - /api/tables/available → Allow all
    
    // Protected endpoints
    - /api/admin/**      → Require ADMIN role
    - /api/orders/**     → Require authentication
    
    // JWT Filter
    - Intercept mọi request
    - Validate JWT token
    - Extract user info
}
```

#### JWT Flow
```
Login → Generate Token:
Header.Payload.Signature

Payload: {
    userId: 1,
    username: "admin",
    role: "ADMIN",
    exp: 2024-01-02
}

Request → Validate Token → Extract user → Grant access
```

### 🔌 5.3. API Endpoints Summary

#### 🔓 Public Endpoints
```
POST   /api/auth/register              - Đăng ký
POST   /api/auth/login                 - Đăng nhập
GET    /api/products                   - Xem tất cả sản phẩm
GET    /api/products/available         - Xem sản phẩm còn hàng
GET    /api/products/category/{cat}    - Xem theo danh mục
GET    /api/products/{id}              - Xem chi tiết sản phẩm
GET    /api/tables/available           - Xem bàn trống
```

#### 👤 User Endpoints (Cần authentication)
```
POST   /api/orders                     - Đặt hàng
GET    /api/orders/my-orders           - Xem đơn của mình
GET    /api/orders/{id}                - Xem chi tiết đơn
DELETE /api/orders/{id}                - Hủy đơn
```

#### 👑 Admin Endpoints (Cần ADMIN role)
```
# Product Management
POST   /api/admin/products             - Tạo sản phẩm
PUT    /api/admin/products/{id}        - Sửa sản phẩm
DELETE /api/admin/products/{id}        - Xóa sản phẩm
PATCH  /api/admin/products/{id}/toggle - Bật/tắt sản phẩm

# Table Management
POST   /api/admin/tables               - Tạo bàn
PUT    /api/admin/tables/{id}          - Sửa bàn
DELETE /api/admin/tables/{id}          - Xóa bàn
PATCH  /api/admin/tables/{id}/status   - Cập nhật trạng thái bàn

# Order Management
GET    /api/admin/orders               - Xem tất cả đơn
PATCH  /api/admin/orders/{id}/status   - Cập nhật trạng thái đơn

# Statistics
GET    /api/admin/statistics           - Xem thống kê
```

---

## 6. DEMO CÁC TÍNH NĂNG

### 📊 Sample Data (Auto-generated on startup)

#### Users
- Admin: `admin` / `admin123`
- User: `user` / `user123`

#### Products (5 categories, 18 products)
- Coffee: Cà phê đen, cà phê sữa, cappuccino, espresso, bạc xỉu
- Tea: Trà đào cam sả, trà sữa, trà xanh
- Smoothie: Bơ, dâu, xoài
- Juice: Cam vắt, chanh
- Snack: Bánh mì que, khoai tây chiên
- Dessert: Tiramisu, pudding

#### Tables
- 15 bàn (Bàn 1-10: 2 chỗ, Bàn 11-15: 4 chỗ)
- Tất cả status: AVAILABLE

---

## 🎯 TIPS THUYẾT TRÌNH

### 1. Bắt đầu với Demo
- Show hệ thống đang chạy
- Đăng nhập với 2 vai trò khác nhau
- Demo đặt hàng flow

### 2. Giải thích Architecture
- Vì sao dùng Layered Architecture?
- Separation of concerns: Controller - Service - Repository
- Database relationships: OneToMany, ManyToOne

### 3. Highlight Security
- JWT Authentication
- Password encryption
- Role-based access control
- CORS configuration

### 4. Show Code Examples
- Đọc một Controller method
- Giải thích flow
- Show database relationship

### 5. Best Practices
- Dependency Injection (Lombok @RequiredArgsConstructor)
- Exception handling
- Clean code
- RESTful API design

---

## 🔗 ĐIỂM MẠNH CỦA HỆ THỐNG

✅ **Security**: JWT + BCrypt + RBAC  
✅ **Scalability**: Layered architecture, separation of concerns  
✅ **Maintainability**: Clean code, proper structure  
✅ **Database**: JPA/Hibernate ORM, automatic migrations  
✅ **Error Handling**: Proper exception handling  
✅ **RESTful**: Standard REST API design  
✅ **Docker**: Containerized, easy deployment  

---

## 📊 DATABASE RELATIONSHIP DIAGRAM

```
┌─────────────┐         ┌─────────────┐
│    User     │────────<│    Order    │
│─────────────│ 1    N  │─────────────│
│ id          │         │ id          │
│ username    │         │ user_id     │
│ password    │         │ table_id    │
│ fullName    │         │ totalPrice  │
│ email       │         │ status      │
│ phone       │         │ createdAt   │
│ role        │         │ completedAt │
└─────────────┘         └───────┬─────┘
                                │ N
                                │
                                │
┌─────────────┐         ┌───────▼─────────┐
│CafeTable    │────────<│  OrderItem      │
│─────────────│ 1    N  │─────────────────│
│ id          │         │ id              │
│ tableNumber │         │ order_id        │
│ capacity    │         │ product_id      │
│ status      │         │ quantity        │
└─────────────┘         │ price           │
                        │ note            │
                        └────────┬────────┘
                                 │ N
                                 │
                        ┌────────▼────────┐
                        │    Product      │
                        │─────────────────│
                        │ id              │
                        │ name            │
                        │ description     │
                        │ price           │
                        │ imageUrl        │
                        │ category        │
                        │ available       │
                        └─────────────────┘
```

---

## 🔄 CHI TIẾT ORDER FLOW

### Quy trình đặt hàng (CreateOrder)

```
1. User chọn bàn và sản phẩm trên Frontend
   ↓
2. Frontend gửi POST /api/orders
   Headers: Authorization: Bearer <JWT>
   Body: {
     tableId: 5,
     items: [
       { productId: 1, quantity: 2 },
       { productId: 5, quantity: 1 }
     ],
     note: "Ít đá"
   }
   ↓
3. JwtAuthenticationFilter:
   ✓ Validate JWT token
   ✓ Extract userId = 1
   ✓ Set authentication context
   ↓
4. OrderController.createOrder():
   - Lấy userId từ JWT
   - Call OrderService.createOrder()
   ↓
5. OrderService.createOrder():
   a) Validate:
      ✓ User tồn tại?
      ✓ Table tồn tại? & status = AVAILABLE?
      ✓ Products tồn tại? & available = true?
   b) Tạo Order:
      - Set user, table, status = PENDING
      - Tính totalPrice = sum(price × quantity)
      - Tạo các OrderItem
   c) Update Database:
      - Save Order + OrderItems (Cascade)
      - Update Table.status = RESERVED
   ↓
6. Response trả về:
   {
     id: 10,
     user: { id: 1, fullName: "Nguyen Van A" },
     table: { id: 5, tableNumber: 5 },
     items: [
       { product: "Cà phê đen", quantity: 2, price: 25000 },
       { product: "Cappuccino", quantity: 1, price: 45000 }
     ],
     totalPrice: 95000,
     status: "PENDING",
     createdAt: "2024-01-15 10:30:00"
   }
```

### Admin cập nhật trạng thái đơn (UpdateOrderStatus)

```
Admin nhấn nút "Xác nhận đơn" trên Frontend
   ↓
Frontend gửi PATCH /api/admin/orders/10/status
   Headers: Authorization: Bearer <ADMIN_JWT>
   Body: { "status": "CONFIRMED" }
   ↓
Security: Check role = ADMIN → Allow
   ↓
OrderService.updateOrderStatus():
   - Update order.status = CONFIRMED
   - Update table.status = OCCUPIED
   - Save changes
   ↓
Response: Updated OrderResponse với status mới
```

---

## 📝 KẾT LUẬN

Hệ thống Cafe Management được xây dựng với:
- **Kiến trúc rõ ràng**: Dễ maintain, mở rộng
- **Bảo mật cao**: JWT, password encryption, RBAC
- **Performance**: JPA optimization, indexing
- **User-friendly**: RESTful API, clear responses

**Tech Stack hiện đại**: Spring Boot 3.2 + Java 20 + MySQL 8 + JWT

---

## 🎓 TÀI LIỆU THAM KHẢO

- Spring Boot Documentation: https://spring.io/projects/spring-boot
- JWT Best Practices: https://jwt.io/introduction
- RESTful API Design: https://restfulapi.net/
- JPA/Hibernate Guide: https://hibernate.org/orm/documentation/

