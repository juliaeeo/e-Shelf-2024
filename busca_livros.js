// Chave do Google Books
const API_KEY = "AIzaSyByZueS-sEDclSmT-lL4NnJ0Iejwn-251I";

// Função para buscar livros na API do Google Books
async function searchBooks() {
  const query = document.getElementById("searchQuery").value;
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
    );
    const data = await response.json();
    displayResults(data.items);

    //Limpar o campo de busca após a busca
    document.getElementById("searchQuery").value = "";
  } catch (error) {
    console.error(
      "Erro ao buscar livros na API do Google Books",
      error.message
    );
  }
}

// Função para exibir os resultados da busca
function displayResults(books) {
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  if (!books || books.length === 0) {
    resultsDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
    return;
  }

  books.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.className = "book";

    const title = book.volumeInfo.title || "Título não disponível";
    const authors = book.volumeInfo.authors
      ? book.volumeInfo.authors.join(", ")
      : "Autor desconhecido";
    const description = book.volumeInfo.description
      ? book.volumeInfo.description
      : "Descrição não disponível";
    const thumbnail = book.volumeInfo.imageLinks
      ? book.volumeInfo.imageLinks.thumbnail
      : "";

    bookDiv.innerHTML = `
      <div class="book-info">
        <div>
          <img src="${thumbnail}" alt="Capa do livro">
        </div>
        <div>
          <h3>${title}</h3>
          <p><strong>Autores:</strong> ${authors}</p>
          <p>${description}</p>
        </div>
      </div>
    `;

    resultsDiv.appendChild(bookDiv);
  });
}

// Evento de clique para buscar livros
document.getElementById("searchButton").addEventListener("click", searchBooks);
