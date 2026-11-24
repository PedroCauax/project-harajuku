package com.webservice.demo.dto;

import java.util.List;

public record OrderRequest(Long clientId, List<OrderItemRequest> items) {
}
