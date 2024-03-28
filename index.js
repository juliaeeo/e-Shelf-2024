// Função para carregar os livros armazenados no localStorage
function loadBooks() {
  let savedBooks = localStorage.getItem("books");
  if (savedBooks) {
    document.getElementById("bookCatalog").innerHTML = savedBooks;
  }
}

// Função para salvar os livros no localStorage
function saveBooks() {
  let booksHtml = document.getElementById("bookCatalog").innerHTML;
  localStorage.setItem("books", booksHtml);
}

// Função para ordenar os livros pelo título
function sortBooks() {
  const booksContainer = document.getElementById("bookCatalog");
  const books = booksContainer.querySelectorAll(".book");
  const sortedBooks = Array.from(books).sort((a, b) => {
    const titleA = a.querySelector("p:first-of-type").textContent.toLowerCase();
    const titleB = b.querySelector("p:first-of-type").textContent.toLowerCase();
    return titleA.localeCompare(titleB);
  });
  booksContainer.innerHTML = ""; // Limpa o conteúdo atual
  sortedBooks.forEach((book) => booksContainer.appendChild(book)); // Adiciona os livros ordenados de volta ao container
}

// Função para adicionar um novo livro ao catálogo
function addBookToCatalog(livro, serie, autor, ano, finalizado) {
  // Construir informações do livro
  let firstLetter = livro.charAt(0).toUpperCase(); // Obter a primeira letra do título e converter para maiúscula
  let bookInfo =
    "<div class='book'>" +
    "<p><strong>Livro:</strong> " +
    livro +
    "</p>" +
    "<p><strong>Série:</strong> " +
    serie +
    "</p>" +
    "<p><strong>Autor:</strong> " +
    autor +
    "</p>" +
    "<p><strong>Ano de Publicação:</strong> " +
    ano +
    "</p>" +
    "<p><strong>Finalizado:</strong> " +
    finalizado +
    "</p>" +
    "</div>";

  // Adicionar o livro ao catálogo
  document.getElementById("bookCatalog").innerHTML += bookInfo;

  // Adicionar uma classe específica para cada livro
  sortBooks();

  // Salvar os livros atualizados no localStorage
  saveBooks();
}

// Função para submeter o formulário
function submitForm(event) {
  event.preventDefault(); // Prevenir envio padrão do formulário

  // Obter os dados do formulário
  let livro = document.getElementById("livro").value;
  let serie = document.getElementById("serie").value;
  let autor = document.getElementById("autor").value;
  let ano = document.getElementById("ano").value;
  let finalizado = document.querySelector(
    'input[name="finalizado"]:checked'
  ).value;

  // Adicionar o novo livro ao catálogo
  addBookToCatalog(livro, serie, autor, ano, finalizado);

  // Limpar os campos do formulário
  document.getElementById("bookForm").reset();
}

// Adicionar um ouvinte de evento para o envio do formulário
document.getElementById("bookForm").addEventListener("submit", submitForm);

// Carregar os livros ao iniciar a página
loadBooks();
