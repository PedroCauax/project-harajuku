package com.webservice.demo.services;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.webservice.demo.dto.OrderItemRequest;
import com.webservice.demo.dto.OrderRequest;
import com.webservice.demo.entities.Order;
import com.webservice.demo.entities.OrderItem;
import com.webservice.demo.entities.Payment;
import com.webservice.demo.entities.Product;
import com.webservice.demo.entities.User;
import com.webservice.demo.entities.enums.OrderStatus;
import com.webservice.demo.repositories.OrderItemRepository;
import com.webservice.demo.repositories.OrderRepository;
import com.webservice.demo.repositories.ProductRepository;
import com.webservice.demo.repositories.UserRepository;
import com.webservice.demo.services.exceptions.DatabaseException;
import com.webservice.demo.services.exceptions.ResourceNotFoundException;

@Service
public class OrderService {

	@Autowired
	private OrderRepository repository;

	@Autowired
	private OrderItemRepository orderItemRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProductRepository productRepository;

	@Transactional(readOnly = true)
	public List<Order> findAll() {
		return repository.findAll();
	}

	@Transactional(readOnly = true)
	public Order findById(Long id) {
		return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));
	}

	// Cria o pedido da vitrine usando o preço ATUAL de cada produto.
	// O Payment só é criado quando o pedido passa para PAID (veja updateStatus).
	@Transactional
	public Order insert(OrderRequest req) {
		if (req == null || req.items() == null || req.items().isEmpty()) {
			throw new DatabaseException("O pedido precisa ter pelo menos um item.");
		}
		if (req.clientId() == null) {
			throw new DatabaseException("Cliente não informado.");
		}

		User client = userRepository.findById(req.clientId())
				.orElseThrow(() -> new ResourceNotFoundException(req.clientId()));

		Order order = repository.save(new Order(null, Instant.now(), OrderStatus.WAITING_PAYMENT, client));

		for (OrderItemRequest it : req.items()) {
			int quantity = it.quantity() == null ? 0 : it.quantity();
			if (quantity < 1) {
				throw new DatabaseException("Quantidade inválida para o produto " + it.productId() + ".");
			}
			if (it.productId() == null) {
				throw new DatabaseException("Produto não informado.");
			}
			Product product = productRepository.findById(it.productId())
					.orElseThrow(() -> new ResourceNotFoundException(it.productId()));

			OrderItem item = new OrderItem(order, product, quantity, product.getPrice());
			orderItemRepository.save(item);
			order.getItems().add(item);
		}
		return order;
	}

	@Transactional
	public Order updateStatus(Long id, String status) {
		Order order = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException(id));

		OrderStatus newStatus;
		try {
			newStatus = OrderStatus.valueOf(status == null ? "" : status.trim().toUpperCase());
		} catch (IllegalArgumentException e) {
			throw new DatabaseException("Status inválido: " + status);
		}

		order.setOrderStatus(newStatus);
		if (newStatus == OrderStatus.PAID && order.getPayment() == null) {
			order.setPayment(new Payment(null, Instant.now(), order));
		}
		return repository.save(order);
	}
}
