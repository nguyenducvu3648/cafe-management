package cafe.controller;

import cafe.entity.CafeTable;
import cafe.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {
    
    private final TableService tableService;
    
    @GetMapping
    public ResponseEntity<List<CafeTable>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }
    
    @GetMapping("/available")
    public ResponseEntity<List<CafeTable>> getAvailableTables() {
        return ResponseEntity.ok(tableService.getAvailableTables());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getTableById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(tableService.getTableById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}