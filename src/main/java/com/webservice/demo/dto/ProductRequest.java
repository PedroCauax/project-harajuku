package com.webservice.demo.dto;

import java.util.List;

public record ProductRequest(
		String name,
		String description,
		Double price,
		String imgUrl,
		List<Long> categoryIds) {
}
