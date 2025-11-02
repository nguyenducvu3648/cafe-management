package cafe.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tables")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CafeTable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Integer tableNumber;
    
    @Column(nullable = false)
    private Integer capacity;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.AVAILABLE;
    
    public enum Status {
        AVAILABLE,      // Còn trống
        OCCUPIED,       // Đang có khách
        RESERVED,       // Đã đặt
        CLEANING        // Đang dọn dẹp
    }
}