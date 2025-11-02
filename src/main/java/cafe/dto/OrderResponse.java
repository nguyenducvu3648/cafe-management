package cafe.dto;

import java.util.List;

import cafe.entity.Order;
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
public class OrderResponse {
    private Long id;
    private Long userId;
    private String customerName;
    private Long tableId;
    private Integer tableNumber;
    private List<OrderItemResponse> items;
    private Double totalPrice;
    private Order.Status status;
    private String createdAt;
    private String completedAt;
    private String note;
}