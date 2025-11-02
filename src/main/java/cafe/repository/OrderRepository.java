package cafe.repository;

import cafe.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByTableId(Long tableId);
    List<Order> findByStatus(Order.Status status);
    
    @Query("SELECT o FROM Order o WHERE o.createdAt BETWEEN :start AND :end")
    List<Order> findByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
    
    @Query("SELECT SUM(o.totalPrice) FROM Order o WHERE o.status = 'COMPLETED' AND o.completedAt BETWEEN :start AND :end")
    Double getTotalRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}