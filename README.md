# Spring Boot REST API – User Management

REST API developed with **Spring Boot** for user management.
This project focuses on applying backend fundamentals, RESTful architecture, exception handling, and clean code organization following good practices.

---

## 📌 Features

* Create users
* List all users
* Find user by ID
* Update user
* Delete user
* Global exception handling (404, 400, 500)

---

## 🛠 Technologies Used

* Java 17
* Spring Boot
* Spring Data JPA
* H2 Database
* Maven
* Postman (API testing)

---

## 🚀 Running the Project

### Prerequisites

* Java 17 or higher
* Maven

### Steps

```bash
git clone https://github.com/your-username/your-repository.git
cd your-repository
mvn spring-boot:run
```

The application will be available at:

```
http://localhost:8080
```

---

## 🗄 Database

This project uses the **H2 in-memory database**, suitable for testing and learning purposes.

### H2 Console

```
http://localhost:8080/h2-console
```

### Configuration

* JDBC URL: `jdbc:h2:mem:testdb`
* Username: `sa`
* Password: *(empty)*

---

## 🔗 API Endpoints

| Method | Endpoint    | Description       |
| ------ | ----------- | ----------------- |
| GET    | /users      | List all users    |
| GET    | /users/{id} | Find user by ID   |
| POST   | /users      | Create a new user |
| PUT    | /users/{id} | Update a user     |
| DELETE | /users/{id} | Delete a user     |

---

## ⚠ Error Handling

The application uses a global exception handler with `@ControllerAdvice`.

### Possible responses:

* **404** – Resource not found
* **400** – Bad request
* **500** – Internal server error

Error responses follow a standard structure containing:

* Timestamp
* HTTP status
* Error description
* Detailed message
* Request path

---

## 📁 Project Structure

com.webservice.demo
├── controllers
├── entities
├── repositories
├── services
├── exceptions
```

---

## 📚 Project Goal

This project was developed for **educational purposes**, aiming to practice and consolidate knowledge in:

* REST APIs
* Spring Boot
* JPA / Hibernate
* Backend best practices

---

## 📌 Project Status

✅ Completed for study purposes
🚀 Open for future improveme
 This project was developed for learning purposes.


---

## 🖥 Front-end (React + Bootstrap) — HARAJUKU

Pasta `frontend/` (React + Vite + Bootstrap, usando `useState` e `useEffect`). Fala com a API em `http://localhost:8080`.

**Requisitos:** JDK 25 (o JDK completo, não só o JRE) e Node.js 18+ (LTS). Maven não precisa instalar (usa o `mvnw`). **Na primeira vez é preciso internet** (baixa as dependências, inclusive o `spring-security-crypto` usado no BCrypt). Depois funciona sem internet.

**Rodar tudo com um clique:**
* Windows: dois cliques em `iniciar.bat`
* Mac/Linux: `./iniciar.sh`

O site abre em `http://localhost:5173`. Se mexeu no back-end, feche as janelas antigas antes de rodar de novo.

**Rodar manualmente:**
```bash
./mvnw spring-boot:run          # terminal 1 (Windows: mvnw.cmd spring-boot:run)
cd frontend && npm install && npm run dev   # terminal 2
```

### O que tem

* **Loja (tela inicial):** entrada com título gigante, vitrine com busca, filtro por categoria, ordenação e contador, sacola lateral (quantidade, remover, total) e **Finalizar pedido** (`POST /orders`). Sem login, o pedido vai para o cliente padrão (id 1); logado, vai para o usuário logado. A sacola fica salva no navegador.
* **Lookbook:** 4 looks com fotos locais (`public/img/lookbook/`, recortes 4:5).
* **Login e painel:** `POST /auth/login` (BCrypt). Sem login não abre o painel. Botão *Preencher acesso Admin (Demo)*.
* **Painel:** Resumo, Pedidos (mudar status via `PATCH /orders/{id}/status` e recibo), Produtos (galeria de imagens ou upload com pré-visualização, confirmação de exclusão), Categorias e Usuários. Avisos aparecem como toasts, com a mensagem de erro da API.

### Acessos de teste (dados do `TestConfig`, H2 em memória)

| Usuário | E-mail | Senha |
|---|---|---|
| Admin | admin@harajuku.com | admin123 |
| Yuna Park | yuna@gmail.com | 123456 |
| Haru Sato | haru@gmail.com | 123456 |

As senhas são guardadas com BCrypt e **não** aparecem nas respostas da API.

### Observações

* O `Payment` de um pedido é criado quando ele passa para **Pago** (`PAID`).
* Imagem enviada pelo computador é reduzida (máx. 900 px) e salva no banco H2 (em memória, some ao reiniciar o back).
* O nome da loja é a constante `BRAND` em `frontend/src/App.jsx`. A foto da entrada é `frontend/public/img/hero-photo.webp`.
* Os produtos de teste usam as fotos de `frontend/public/img/produtos/` (11 produtos, recortadas em 4:3, a proporção dos cards). Para trocar ou acrescentar fotos, salve em 4:3 (ex.: 1200×900) nessa pasta e escolha na galeria do modal de produto.
