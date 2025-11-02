package cafe.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {
    private Long totalOrders;
    private Long completedOrders;
    private Long pendingOrders;
    private Double totalRevenue;
    private Long totalCustomers;
    private Long availableTables;
}