package com.webservice.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.webservice.demo.entities.User;
import com.webservice.demo.repositories.UserRepository;
import com.webservice.demo.services.exceptions.DatabaseException;
import com.webservice.demo.services.exceptions.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class UserService {

	@Autowired
	private UserRepository repository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public List<User> findAll() {
		return repository.findAll();
	}

	public User findById(Long id) {
		Optional<User> obj = repository.findById(id);
		return obj.orElseThrow(() -> new ResourceNotFoundException(id));
	}

	public User insert(User obj) {
		obj.setId(null);
		if (obj.getPassword() != null && !obj.getPassword().isBlank()) {
			obj.setPassword(passwordEncoder.encode(obj.getPassword()));
		}
		return repository.save(obj);
	}

	public void delete(Long id) {
		try {
	    if (!repository.existsById(id)) {
	        throw new ResourceNotFoundException(id);
	    }
	    repository.deleteById(id);
		} catch (DataIntegrityViolationException e) {
			throw new DatabaseException("Não é possível excluir este usuário porque ele possui pedidos.");
		}
	}

	@Transactional
	public User update(Long id, User obj) {
		try {
			User entity = repository.getReferenceById(id);
			updateData(entity, obj);
			return repository.save(entity);
		} catch (EntityNotFoundException e) {
			throw new ResourceNotFoundException(id);
		}
	}

	private void updateData(User entity, User obj) {
		entity.setName(obj.getName());
		entity.setEmail(obj.getEmail());
		entity.setPhone(obj.getPhone());
	}
}
