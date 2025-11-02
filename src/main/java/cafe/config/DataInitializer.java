package cafe.config;

import cafe.entity.*;
import cafe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final TableRepository tableRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Tạo tài khoản Admin
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Quản trị viên");
            admin.setEmail("admin@cafe.com");
            admin.setPhone("0123456789");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Created Admin account: admin/admin123");
        }
        
        // Tạo tài khoản User mẫu
        if (!userRepository.existsByUsername("user")) {
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setFullName("Nguyễn Văn A");
            user.setEmail("user@gmail.com");
            user.setPhone("0987654321");
            user.setRole(User.Role.USER);
            userRepository.save(user);
            System.out.println("✅ Created User account: user/user123");
        }
        
        // Tạo menu món ăn
        if (productRepository.count() == 0) {
            createProducts();
            System.out.println("✅ Created sample products");
        }
        
        // Tạo bàn
        if (tableRepository.count() == 0) {
            createTables();
            System.out.println("✅ Created sample tables");
        }
    }
    
    private void createProducts() {
        // Coffee
        productRepository.save(new Product(null, "Cà phê đen", "Cà phê truyền thống đậm đà", 25000.0, 
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93", Product.Category.COFFEE, true));
        productRepository.save(new Product(null, "Cà phê sữa", "Cà phê sữa đá thơm ngon", 30000.0, 
            "https://images.unsplash.com/photo-1461023058943-07fcbe16d735", Product.Category.COFFEE, true));
        productRepository.save(new Product(null, "Bạc xỉu", "Cà phê sữa nhiều sữa ít cà phê", 35000.0, 
            "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7", Product.Category.COFFEE, true));
        productRepository.save(new Product(null, "Cappuccino", "Cà phê Ý với bọt sữa mịn", 45000.0, 
            "https://images.unsplash.com/photo-1572442388796-11668a67e53d", Product.Category.COFFEE, true));
        productRepository.save(new Product(null, "Espresso", "Cà phê Ý nguyên chất", 35000.0, 
            "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04", Product.Category.COFFEE, true));
        
        // Tea
        productRepository.save(new Product(null, "Trà đào cam sả", "Trà hoa quả tươi mát", 40000.0, 
            "https://images.unsplash.com/photo-1556679343-c7306c1976bc", Product.Category.TEA, true));
        productRepository.save(new Product(null, "Trà sữa trân châu", "Trà sữa với trân châu đen", 45000.0, 
            "https://images.unsplash.com/photo-1525385133512-2f3bdd039054", Product.Category.TEA, true));
        productRepository.save(new Product(null, "Trà xanh", "Trà xanh nguyên chất", 30000.0, 
            "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9", Product.Category.TEA, true));
        
        // Smoothie
        productRepository.save(new Product(null, "Sinh tố bơ", "Sinh tố bơ béo ngậy", 45000.0, 
            "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4", Product.Category.SMOOTHIE, true));
        productRepository.save(new Product(null, "Sinh tố dâu", "Sinh tố dâu tươi", 40000.0, 
            "https://images.unsplash.com/photo-1553530666-ba11a7da3888", Product.Category.SMOOTHIE, true));
        productRepository.save(new Product(null, "Sinh tố xoài", "Sinh tố xoài ngọt mát", 40000.0, 
            "https://images.unsplash.com/photo-1600271886742-f049cd451bba", Product.Category.SMOOTHIE, true));
        
        // Juice
        productRepository.save(new Product(null, "Nước cam vắt", "Cam tươi vắt 100%", 35000.0, 
            "https://images.unsplash.com/photo-1600271886742-f049cd451bba", Product.Category.JUICE, true));
        productRepository.save(new Product(null, "Nước chanh", "Chanh tươi mát lạnh", 25000.0, 
            "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9f", Product.Category.JUICE, true));
        
        // Snack
        productRepository.save(new Product(null, "Bánh mì que", "Bánh mì que giòn rụm", 15000.0, 
            "https://images.unsplash.com/photo-1509440159596-0249088772ff", Product.Category.SNACK, true));
        productRepository.save(new Product(null, "Khoai tây chiên", "Khoai tây lắc phô mai", 30000.0, 
            "https://images.unsplash.com/photo-1573080496219-bb080dd4f877", Product.Category.SNACK, true));
        
        // Dessert
        productRepository.save(new Product(null, "Bánh tiramisu", "Bánh tiramisu Ý", 55000.0, 
            "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9", Product.Category.DESSERT, true));
        productRepository.save(new Product(null, "Pudding", "Pudding trứng caramel", 35000.0, 
            "https://images.unsplash.com/photo-1488477181946-6428a0291777", Product.Category.DESSERT, true));
    }
    
    private void createTables() {
        for (int i = 1; i <= 15; i++) {
            CafeTable table = new CafeTable();
            table.setTableNumber(i);
            table.setCapacity(i <= 10 ? 2 : 4); // Bàn 1-10: 2 chỗ, bàn 11-15: 4 chỗ
            table.setStatus(CafeTable.Status.AVAILABLE);
            tableRepository.save(table);
        }
    }
}