package com.webservice.demo.config;

import java.time.Instant;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.webservice.demo.entities.Category;
import com.webservice.demo.entities.Order;
import com.webservice.demo.entities.OrderItem;
import com.webservice.demo.entities.Payment;
import com.webservice.demo.entities.Product;
import com.webservice.demo.entities.User;
import com.webservice.demo.entities.enums.OrderStatus;
import com.webservice.demo.repositories.CategoryRepository;
import com.webservice.demo.repositories.OrderItemRepository;
import com.webservice.demo.repositories.OrderRepository;
import com.webservice.demo.repositories.ProductRepository;
import com.webservice.demo.repositories.UserRepository;

@Configuration
@Profile("test")
public class TestConfig implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private CategoryRepository categoryRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private OrderItemRepository orderItemRepository;

	@Override
	public void run(String... args) throws Exception {

		Category cat1 = new Category(null, "Camisetas");
		Category cat2 = new Category(null, "Calças");
		Category cat3 = new Category(null, "Calçados");
		Category cat4 = new Category(null, "Moletons e Suéteres");
		Category cat5 = new Category(null, "Jaquetas");

		Product p1 = new Product(null, "Tênis Retrô Preto e Laranja", "Cano baixo em preto, branco e laranja, clássico de rua.", 449.90, "/img/produtos/tenis-retro-preto-laranja.jpg");
		Product p2 = new Product(null, "Jeans Baggy Lavagem Clara", "Jeans largo com lavagem clara e detalhe rasgado no joelho.", 299.90, "/img/produtos/jeans-baggy-claro.jpg");
		Product p3 = new Product(null, "Tênis Chunky Branco", "Solado alto e recortes prateados. Combina com tudo.", 489.90, "/img/produtos/tenis-chunky-branco.jpg");
		Product p4 = new Product(null, "Camiseta Oversized Gráfica", "Camiseta preta lavada, caimento largo e estampa grande nas costas.", 169.90, "/img/produtos/camiseta-oversized-grafica.jpg");
		Product p5 = new Product(null, "Suéter Navy Street", "Suéter azul-marinho de gola alta com camisa branca por baixo.", 389.90, "/img/produtos/conjunto-navy-street.jpg");
		Product p6 = new Product(null, "Camiseta Oversized Bordada", "Camiseta preta lavada com bordado branco e detalhe vermelho no peito.", 179.90, "/img/produtos/camiseta-bordada-preta.jpg");
		Product p7 = new Product(null, "Camiseta Preta Dragão", "Camiseta preta oversized com estampa de dragão em branco.", 159.90, "/img/produtos/camiseta-dragao-preta.jpg");
		Product p8 = new Product(null, "Camiseta Branca Estampa nas Costas", "Camiseta branca de caimento solto com grande estampa ilustrada nas costas.", 169.90, "/img/produtos/camiseta-branca-costas.jpg");
		Product p9 = new Product(null, "Calça Cargo Couro Sintético", "Calça larga em couro sintético preto, bolsos grandes e corrente.", 349.90, "/img/produtos/calca-cargo-couro.jpg");
		Product p10 = new Product(null, "Bota Laranja Street", "Bota laranja de cano curto com solado de borracha.", 429.90, "/img/produtos/bota-laranja.jpg");
		Product p11 = new Product(null, "Jaqueta Puffer Branca", "Jaqueta acolchada off-white com capuz e bolsos frontais.", 689.90, "/img/produtos/jaqueta-puffer-branca.jpg");

		categoryRepository.saveAll(Arrays.asList(cat1, cat2, cat3, cat4, cat5));
		productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11));

		p1.getCategories().add(cat3);
		p2.getCategories().add(cat2);
		p3.getCategories().add(cat3);
		p4.getCategories().add(cat1);
		p5.getCategories().add(cat4);
		p6.getCategories().add(cat1);
		p7.getCategories().add(cat1);
		p8.getCategories().add(cat1);
		p9.getCategories().add(cat2);
		p10.getCategories().add(cat3);
		p11.getCategories().add(cat5);

		productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11));

		User u1 = new User(null, "Yuna Park", "yuna@gmail.com", "988888888", passwordEncoder.encode("123456"));
		User u2 = new User(null, "Haru Sato", "haru@gmail.com", "977777777", passwordEncoder.encode("123456"));
		User u3 = new User(null, "Admin Harajuku", "admin@harajuku.com", "999999999", passwordEncoder.encode("admin123"));

		Order o1 = new Order(null, Instant.parse("2026-10-20T19:53:07Z"), OrderStatus.PAID, u1);
		Order o2 = new Order(null, Instant.parse("2026-11-05T03:42:10Z"), OrderStatus.WAITING_PAYMENT, u2);
		Order o3 = new Order(null, Instant.parse("2026-11-12T15:21:22Z"), OrderStatus.WAITING_PAYMENT, u1);

		userRepository.saveAll(Arrays.asList(u1, u2, u3));
		orderRepository.saveAll(Arrays.asList(o1, o2, o3));

		OrderItem oi1 = new OrderItem(o1, p1, 2, p1.getPrice());
		OrderItem oi2 = new OrderItem(o1, p3, 1, p3.getPrice());
		OrderItem oi3 = new OrderItem(o2, p3, 2, p3.getPrice());
		OrderItem oi4 = new OrderItem(o3, p5, 2, p5.getPrice());

		orderItemRepository.saveAll(Arrays.asList(oi1, oi2, oi3, oi4));
		
		Payment pay1 = new Payment(null, Instant.parse("2026-10-20T21:53:07Z"), o1);
		o1.setPayment(pay1);
		orderRepository.save(o1);
	}
}