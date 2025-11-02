package cafe.service;


import java.util.List;

import org.springframework.stereotype.Service;

import cafe.entity.CafeTable;
import cafe.repository.TableRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TableService {
    
    private final TableRepository tableRepository;
    
    public List<CafeTable> getAllTables() {
        return tableRepository.findAll();
    }
    
    public List<CafeTable> getAvailableTables() {
        return tableRepository.findByStatus(CafeTable.Status.AVAILABLE);
    }
    
    public CafeTable getTableById(Long id) {
        return tableRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bàn không tồn tại"));
    }
    
    public CafeTable createTable(CafeTable table) {
        if (tableRepository.existsByTableNumber(table.getTableNumber())) {
            throw new RuntimeException("Số bàn đã tồn tại");
        }
        return tableRepository.save(table);
    }
    
    public CafeTable updateTable(Long id, CafeTable tableDetails) {
        CafeTable table = getTableById(id);
        
        if (!table.getTableNumber().equals(tableDetails.getTableNumber()) &&
            tableRepository.existsByTableNumber(tableDetails.getTableNumber())) {
            throw new RuntimeException("Số bàn đã tồn tại");
        }
        
        table.setTableNumber(tableDetails.getTableNumber());
        table.setCapacity(tableDetails.getCapacity());
        table.setStatus(tableDetails.getStatus());
        
        return tableRepository.save(table);
    }
    
    public void deleteTable(Long id) {
        CafeTable table = getTableById(id);
        tableRepository.delete(table);
    }
    
    public CafeTable updateTableStatus(Long id, CafeTable.Status status) {
        CafeTable table = getTableById(id);
        table.setStatus(status);
        return tableRepository.save(table);
    }
}