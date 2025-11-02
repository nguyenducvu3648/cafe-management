package cafe.service;

import cafe.entity.Product;
import cafe.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Product> getAvailableProducts() {
        return productRepository.findByAvailable(true);
    }
    
    public List<Product> getProductsByCategory(Product.Category category) {
        return productRepository.findByCategoryAndAvailable(category, true);
    }
    
    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Món không tồn tại"));
    }
    
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategory(productDetails.getCategory());
        product.setAvailable(productDetails.getAvailable());
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
    
    public Product toggleAvailability(Long id) {
        Product product = getProductById(id);
        product.setAvailable(!product.getAvailable());
        return productRepository.save(product);
    }
}