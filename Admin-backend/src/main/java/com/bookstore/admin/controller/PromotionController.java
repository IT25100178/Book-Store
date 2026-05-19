package com.bookstore.admin.controller;

import com.bookstore.admin.model.Promotion;
import com.bookstore.admin.service.PromotionManager;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/promotions")
@CrossOrigin(origins = "*")
public class PromotionController {

    private final PromotionManager manager;

    public PromotionController(PromotionManager manager) {
        this.manager = manager;
    }

    @GetMapping
    public List<Promotion> getAll() {
        return manager.getAll();
    }

    @PostMapping
    public Promotion create(@RequestBody Promotion promotion) throws Exception {
        return manager.add(promotion);
    }

    @PutMapping("/{id}")
    public Promotion update(@PathVariable String id, @RequestBody Promotion promotion) throws Exception {
        return manager.update(id, promotion);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) throws Exception {
        manager.delete(id);
    }
}
