package cafe.repository;

import cafe.entity.CafeTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TableRepository extends JpaRepository<CafeTable, Long> {
    Optional<CafeTable> findByTableNumber(Integer tableNumber);
    List<CafeTable> findByStatus(CafeTable.Status status);
    boolean existsByTableNumber(Integer tableNumber);
}


