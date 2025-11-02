-- Tạo database
CREATE DATABASE IF NOT EXISTS cafe_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE cafe_management;

-- Xóa các bảng nếu đã tồn tại (để reset)
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS tables;
DROP TABLE IF EXISTS users;

-- Bảng users
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng products
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DOUBLE NOT NULL,
    image_url VARCHAR(500),
    category ENUM('COFFEE', 'TEA', 'SMOOTHIE', 'JUICE', 'SNACK', 'DESSERT') NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    INDEX idx_category (category),
    INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng tables
CREATE TABLE tables (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_number INT UNIQUE NOT NULL,
    capacity INT NOT NULL,
    status ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING') NOT NULL DEFAULT 'AVAILABLE',
    INDEX idx_status (status),
    INDEX idx_table_number (table_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng orders
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    table_id BIGINT NOT NULL,
    total_price DOUBLE NOT NULL DEFAULT 0,
    status ENUM('PENDING', 'CONFIRMED', 'SERVING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    note TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_table_id (table_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Bảng order_items
CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    note TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;