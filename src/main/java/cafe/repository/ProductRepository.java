package cafe.repository;

import cafe.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByAvailable(Boolean available);
    List<Product> findByCategory(Product.Category category);
    List<Product> findByCategoryAndAvailable(Product.Category category, Boolean available);
}


