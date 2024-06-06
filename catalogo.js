// Mostrar opções da conta
document
  .getElementById("account-toggle")
  .addEventListener("click", function () {
    const accountOptions = document.getElementById("account-options");
    accountOptions.style.display =
      accountOptions.style.display === "none" ? "block" : "none";
  });

// Logout e redirecionamento
document.getElementById("logout").addEventListener("click", function (event) {
  event.preventDefault();
  // lógica para o logout
  window.location.href = "index.html";
});

// // Inicialize o Supabase com as credenciais do seu projeto
const supabaseUrl = "https://uyxbhreygsckfskebocj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGJocmV5Z3Nja2Zza2Vib2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjkxMDgsImV4cCI6MjAyODM0NTEwOH0.f4hfGh5xpT8-rFsfIOElu9msfxtHtpiz7HsIzjTYdko";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função para verificar a autenticação do usuário
async function checkUserAuthentication() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Erro ao obter o usuário", error.message);
    return null;
  }
  if (!user) {
    console.error("Usuário não está logado");
    return null;
  }
  return user;
}

// Função para salvar os dados do formulário na tabela "livros"
async function saveFormData(livro, autor, serie, ano, finalizado) {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

    const { data, error } = await supabase
      .from("livros")
      .insert([{ livro, autor, serie, ano, finalizado, user_id: user.id }]);
    if (error) {
      throw error;
    }
    console.log("Dados inseridos com sucesso", data);
    return data;
  } catch (error) {
    console.error("Erro ao inserir dados no Supabase", error.message);
    throw error;
  }
}

// Função para salvar os resultados da busca na tabela "livros_busca"
async function saveSearchResult(livro, autor, genero, data) {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

    const { data: insertData, error } = await supabase
      .from("livros_busca")
      .insert([{ livro, autor, genero, data, user_id: user.id }]);
    if (error) {
      throw error;
    }
    console.log("Dados inseridos com sucesso", insertData);
    return insertData;
  } catch (error) {
    console.error("Erro ao inserir dados no Supabase", error.message);
    throw error;
  }
}

// Envio do formulário
document
  .getElementById("submitBtn")
  .addEventListener("click", async function () {
    const livro = document.getElementById("livro").value;
    const autor = document.getElementById("autor").value;
    const serie = document.getElementById("serie").value;
    const ano = document.getElementById("ano").value;
    const finalizado = document.querySelector(
      'input[name="finalizado"]:checked'
    ).value;

    try {
      await saveFormData(livro, autor, serie, ano, finalizado);
      alert("Dados enviados com sucesso");
      document.getElementById("bookForm").reset();
      displayData();
    } catch (error) {
      alert("Ocorreu um erro ao enviar os dados");
      console.error(error);
    }
  });

// Chave da API do Google Books
const API_KEY = "AIzaSyByZueS-sEDclSmT-lL4NnJ0Iejwn-251I";

// Função para buscar livros na API do Google Books
async function searchBooks() {
  const query = document.getElementById("searchQuery").value;
  const resultsList = document.getElementById("searchResults");
  resultsList.innerHTML = "";

  if (query.length < 3) {
    resultsList.style.display = "none";
    return;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`
    );
    const data = await response.json();
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
  resultsList.innerHTML = "";

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
    const publishedDate =
      book.volumeInfo.publishedDate || "Data não disponível";
    const publishedYear =
      publishedDate !== "Data não disponível"
        ? new Date(publishedDate).getFullYear().toString()
        : "Ano não disponível";
    const genres = book.volumeInfo.categories
      ? book.volumeInfo.categories.join(", ")
      : "Gênero não disponível";

    const listItem = document.createElement("li");
    listItem.textContent = `${title} - ${authors} - ${genres} - ${publishedYear}`;

    listItem.addEventListener("click", async () => {
      try {
        await saveSearchResult(title, authors, genres, publishedYear);
        displayData();
        resultsList.style.display = "none";
        resultsList.innerHTML = "";
        document.getElementById("searchQuery").value = ""; // limpa a barra de busca
      } catch (error) {
        console.error("Erro ao salvar o livro buscado", error.message);
      }
    });

    resultsList.appendChild(listItem);
  });

  resultsList.style.display = "block";
}

// Adiciona um ouvinte de eventos de clique ao documento para limpar os resultados da barra de buscas
document.addEventListener("click", function (event) {
  const searchResults = document.getElementById("searchResults");
  const searchQuery = document.getElementById("searchQuery");
  // Verifica se o clique não foi dentro dos resultados de busca
  if (!event.target.closest("#searchResults")) {
    // Limpa os resultados de busca e oculta o elemento
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
    searchQuery.value = "";
  }
});

// Event listener para a barra de busca
document.getElementById("searchQuery").addEventListener("input", searchBooks);

// Função para carregar e exibir os dados do Supabase na página
async function displayData() {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

    // Obter os livros do usuário logado das duas tabelas
    const [livrosResponse, livrosBuscaResponse] = await Promise.all([
      supabase.from("livros").select().eq("user_id", user.id),
      supabase.from("livros_busca").select().eq("user_id", user.id),
    ]);

    if (livrosResponse.error) throw livrosResponse.error;
    if (livrosBuscaResponse.error) throw livrosBuscaResponse.error;

    const livros = livrosResponse.data;
    const livrosBusca = livrosBuscaResponse.data;

    const userDataElement = document.getElementById("bookCatalog");
    userDataElement.innerHTML = "";

    // Exibir os dados da tabela "livros"
    livros.forEach((livro) => {
      const userDiv = document.createElement("div");
      userDiv.classList.add("livro");
      userDiv.innerHTML = `
        <p><strong>Livro:</strong> ${livro.livro}</p>
        <p><strong>Autor:</strong> ${livro.autor}</p>
        <p><strong>Gênero:</strong> ${livro.serie}</p>
        <p><strong>Ano:</strong> ${livro.ano}</p>
        <p><strong>Finalizado:</strong> ${livro.finalizado}</p>
      `;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "x";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", async () => {
        try {
          const { error } = await supabase
            .from("livros")
            .delete()
            .eq("id", livro.id);
          if (error) throw error;
          displayData();
        } catch (error) {
          console.error("Erro ao excluir registro", error.message);
        }
      });

      userDiv.appendChild(deleteButton);
      userDataElement.appendChild(userDiv);
    });

    // Exibir os dados da tabela "livros_busca"
    livrosBusca.forEach((livro) => {
      const userDiv = document.createElement("div");
      userDiv.classList.add("livro");
      userDiv.innerHTML = `
        <p><strong>Livro:</strong> ${livro.livro}</p>
        <p><strong>Autor:</strong> ${livro.autor}</p>
        <p><strong>Gênero:</strong> ${livro.genero}</p>
        <p><strong>Ano:</strong> ${livro.data}</p>
      `;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "x";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", async () => {
        try {
          const { error } = await supabase
            .from("livros_busca")
            .delete()
            .eq("id", livro.id);
          if (error) throw error;
          displayData();
        } catch (error) {
          console.error("Erro ao excluir registro", error.message);
        }
      });

      userDiv.appendChild(deleteButton);
      userDataElement.appendChild(userDiv);
    });
  } catch (error) {
    console.error("Erro ao carregar dados do Supabase", error.message);
  }
}

// Carrega os dados ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  displayData();
});
