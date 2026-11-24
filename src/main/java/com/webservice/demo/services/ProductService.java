package com.webservice.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.webservice.demo.dto.ProductRequest;
import com.webservice.demo.entities.Product;
import com.webservice.demo.repositories.CategoryRepository;
import com.webservice.demo.repositories.ProductRepository;
import com.webservice.demo.services.exceptions.DatabaseException;
import com.webservice.demo.services.exceptions.ResourceNotFoundException;

@Service
public class ProductService {

	@Autowired
	private ProductRepository repository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Transactional(readOnly = true)
	public List<Product> findAll() {
		return repository.findAll();
	}

	@Transactional(readOnly = true)
	public Product findById(Long id) {
		Optional<Product> obj = repository.findById(id);
		return obj.get();
	}

	@Transactional
	public Product insert(ProductRequest req) {
		Product entity = new Product();
		applyData(entity, req);
		return repository.save(entity);
	}

	@Transactional
	public Product update(Long id, ProductRequest req) {
		Product entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
		applyData(entity, req);
		return repository.save(entity);
	}

	public void delete(Long id) {
		try {
			if (!repository.existsById(id)) {
				throw new ResourceNotFoundException(id);
			}
			repository.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException("Não é possível excluir este produto porque ele já foi usado em pedidos.");
		}
	}

	private void applyData(Product entity, ProductRequest req) {
		entity.setName(req.name());
		entity.setDescription(req.description());
		entity.setPrice(req.price());
		entity.setImgUrl(req.imgUrl());

		entity.getCategories().clear();
		if (req.categoryIds() != null) {
			for (Long categoryId : req.categoryIds()) {
				entity.getCategories().add(
						categoryRepository.findById(categoryId).orElseThrow(() -> new ResourceNotFoundException(categoryId)));
			}
		}
	}
}
