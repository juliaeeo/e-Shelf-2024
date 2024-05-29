// Chave da API do Google Books
const API_KEY = "AIzaSyByZueS-sEDclSmT-lL4NnJ0Iejwn-251I";

// Função para buscar livros na API do Google Books
async function searchBooks() {
  const query = document.getElementById("searchQuery").value;
  const resultsList = document.getElementById("searchResults");
  resultsList.innerHTML = ""; // Limpa a lista de resultados

  if (query.length < 3) {
    resultsList.style.display = "none";
    return; // Não faz a busca se o texto na barra de busca for muito curto
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
    );
    const data = await response.json();

    // Atualiza a lista de resultados com os resultados da busca
    displayResults(data.items);
  } catch (error) {
    console.error(
      "Erro ao buscar livros na API do Google Books",
      error.message
    );
  }
}

// Função para exibir os resultados da busca
function displayResults(books) {
  const resultsList = document.getElementById("searchResults");
  resultsList.innerHTML = ""; // Limpa a lista de resultados

  if (!books || books.length === 0) {
    const listItem = document.createElement("li");
    listItem.textContent = "Nenhum resultado encontrado.";
    resultsList.appendChild(listItem);
    resultsList.style.display = "block";
    return;
  }

  books.forEach((book) => {
    const title = book.volumeInfo.title || "Título não disponível";
    const authors = book.volumeInfo.authors
      ? book.volumeInfo.authors.join(", ")
      : "Autor desconhecido";

    const listItem = document.createElement("li");
    const link = document.createElement("a"); // Criar um elemento de link
    link.href = book.volumeInfo.previewLink; // Definir o link do livro como o link do resultado
    link.target = "_blank";
    link.textContent = `${title} - ${authors}`;
    listItem.appendChild(link); // Adicionar o link ao item da lista
    resultsList.appendChild(listItem);
  });

  resultsList.style.display = "block";
}

// Evento de input para acionar a busca em tempo real
document.getElementById("searchQuery").addEventListener("input", searchBooks);

// Esconder a lista de resultados quando o usuário clica fora dela
document.addEventListener("click", (event) => {
  const resultsList = document.getElementById("searchResults");
  const searchContainer = document.querySelector(".search-container");
  if (!searchContainer.contains(event.target)) {
    resultsList.style.display = "none";
  }
});

// ----------------------------------------------------------------
// backup
// Chave do Google Books
// const API_KEY = "AIzaSyByZueS-sEDclSmT-lL4NnJ0Iejwn-251I";

// Função para buscar livros na API do Google Books
// async function searchBooks() {
//   const query = document.getElementById("searchQuery").value;
//   try {
//     const response = await fetch(
//       `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
//     );
//     const data = await response.json();
//     displayResults(data.items);

//Limpar o campo de busca após a busca
//     document.getElementById("searchQuery").value = "";
//   } catch (error) {
//     console.error(
//       "Erro ao buscar livros na API do Google Books",
//       error.message
//     );
//   }
// }

// Função para exibir os resultados da busca
// function displayResults(books) {
//   const resultsDiv = document.getElementById("results");
//   resultsDiv.innerHTML = "";

//   if (!books || books.length === 0) {
//     resultsDiv.innerHTML = "<p>Nenhum resultado encontrado.</p>";
//     return;
//   }

//   books.forEach((book) => {
//     const bookDiv = document.createElement("div");
//     bookDiv.className = "book";

//     const title = book.volumeInfo.title || "Título não disponível";
//     const authors = book.volumeInfo.authors
//       ? book.volumeInfo.authors.join(", ")
//       : "Autor desconhecido";
//     const publishedDate =
//       book.volumeInfo.publishedDate || "Data de publicação não disponível";

//     bookDiv.innerHTML = `
//     <div class="book-info">
//        <div>
//       <p><strong>Livro: </strong>${title}</p>
//       <p><strong>Autores:</strong> ${authors}</p>
//       <p><strong>Data de Publicação:</strong> ${publishedDate}</p>
//           </div>
//   </div>
// `;

//     resultsDiv.appendChild(bookDiv);
//   });
// }

// Evento de clique para buscar livros
// document.getElementById("searchButton").addEventListener("click", searchBooks);
