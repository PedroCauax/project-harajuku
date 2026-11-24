package com.webservice.demo.resources;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webservice.demo.dto.LoginRequest;
import com.webservice.demo.dto.LoginResponse;
import com.webservice.demo.entities.User;
import com.webservice.demo.repositories.UserRepository;

@RestController
@RequestMapping(value = "/auth")
public class AuthResource {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping(value = "/login")
	public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
		if (req == null || req.email() == null || req.password() == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		Optional<User> found = userRepository.findFirstByEmailIgnoreCase(req.email().trim());
		if (found.isEmpty() || !passwordEncoder.matches(req.password(), found.get().getPassword())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

		User u = found.get();
		LoginResponse body = new LoginResponse(u.getId(), u.getName(), u.getEmail(), u.getPhone(),
				UUID.randomUUID().toString());
		return ResponseEntity.ok(body);
	}
}
