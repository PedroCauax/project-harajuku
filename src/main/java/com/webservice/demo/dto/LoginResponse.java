package com.webservice.demo.dto;

public record LoginResponse(Long id, String name, String email, String phone, String token) {
}
