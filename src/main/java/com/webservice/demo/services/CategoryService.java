package com.webservice.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.webservice.demo.entities.Category;
import com.webservice.demo.repositories.CategoryRepository;
import com.webservice.demo.services.exceptions.DatabaseException;
import com.webservice.demo.services.exceptions.ResourceNotFoundException;

@Service
public class CategoryService {

	@Autowired
	private CategoryRepository repository;

	public List<Category> findAll() {
		return repository.findAll();
	}

	public Category findById(Long id) {
		Optional<Category> obj = repository.findById(id);
		return obj.get();
	}

	public Category insert(Category obj) {
		obj.setId(null);
		return repository.save(obj);
	}

	@Transactional
	public Category update(Long id, Category obj) {
		Category entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
		entity.setName(obj.getName());
		return repository.save(entity);
	}

	public void delete(Long id) {
		try {
			if (!repository.existsById(id)) {
				throw new ResourceNotFoundException(id);
			}
			repository.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException("Não é possível excluir esta categoria porque ela possui produtos vinculados.");
		}
	}
}
