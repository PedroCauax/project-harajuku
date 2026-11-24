package com.webservice.demo.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.webservice.demo.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findFirstByEmailIgnoreCase(String email);
}
