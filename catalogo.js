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
// javascript pros ícones de filtro, ordenação e estatística
document.addEventListener("DOMContentLoaded", function () {
  const filterButton = document.getElementById("filterButton");
  const sortButton = document.getElementById("sortButton");
  const sortAuthorButton = document.getElementById("sortAuthorButton");
  const sortGenreButton = document.getElementById("sortGenreButton");
  const statusButton = document.getElementById("statusButton");
  const statsButton = document.getElementById("statsButton");

  const filterOptions = document.getElementById("filterOptions");
  const sortOptions = sortButton.nextElementSibling;
  const sortAuthorOptions = sortAuthorButton.nextElementSibling;
  const sortGenreOptions = sortGenreButton.nextElementSibling;
  const statsOptions = statsButton.nextElementSibling;

  filterButton.addEventListener("click", () => {
    toggleDropdown(filterOptions);
  });

  sortButton.addEventListener("click", () => {
    toggleDropdown(sortOptions);
  });

  sortAuthorButton.addEventListener("click", () => {
    toggleDropdown(sortAuthorOptions);
  });

  sortGenreButton.addEventListener("click", () => {
    toggleDropdown(sortGenreOptions);
  });

  statsButton.addEventListener("click", () => {
    toggleDropdown(statsOptions);
  });

  function toggleDropdown(element) {
    element.style.display =
      element.style.display === "block" ? "none" : "block";
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".dropdown")) {
      closeAllDropdowns();
    }
  });

  function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll(
      ".dropdown-content, .dropdown-statistic"
    );
    dropdowns.forEach((dropdown) => {
      dropdown.style.display = "none";
    });
  }
});

// -------------------------------------------------------
// -------------------------------------------------------
// -------------------------------------------------------

// Inicialize o Supabase com as credenciais do seu projeto
const supabaseUrl = "https://uyxbhreygsckfskebocj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGJocmV5Z3Nja2Zza2Vib2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjkxMDgsImV4cCI6MjAyODM0NTEwOH0.f4hfGh5xpT8-rFsfIOElu9msfxtHtpiz7HsIzjTYdko";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// -------------------------------------------------------
// -------------------------------------------------------
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

// -------------------------------------------------------
// -------------------------------------------------------
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

// -------------------------------------------------------
// -------------------------------------------------------
// Função para salvar os resultados da busca na tabela "livros_busca"
async function saveSearchResult(livro, autor, genero, data, finalizado) {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

    const { data: insertData, error } = await supabase
      .from("livros_busca")
      .insert([{ livro, autor, genero, data, finalizado, user_id: user.id }]);
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

// -------------------------------------------------------
// -------------------------------------------------------
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

// -------------------------------------------------------
// -------------------------------------------------------
// Chave da API do Google Books
const API_KEY = "AIzaSyByZueS-sEDclSmT-lL4NnJ0Iejwn-251I";

// -------------------------------------------------------
// -------------------------------------------------------
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

// -------------------------------------------------------
// -------------------------------------------------------
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
      const finalizado = prompt(
        "Informe o status do livro (Sim para livro finalizado, Não para futura leitura ou desistência da leitura, Em andamento para leitura em andamento.):",
        "Sim"
      );
      if (!finalizado) return;

      try {
        await saveSearchResult(
          title,
          authors,
          genres,
          publishedYear,
          finalizado
        );
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
  // Verifica se o clique não foi dentro dos resultados de busca ou da barra de pesquisa
  if (
    !event.target.closest("#searchResults") &&
    !event.target.closest("#searchQuery")
  ) {
    // Limpa os resultados de busca, oculta o elemento e limpa o campo de busca
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
    searchQuery.value = "";
  }
});

// Event listener para a barra de busca
document.getElementById("searchQuery").addEventListener("input", searchBooks);

// -------------------------------------------------------
// -------------------------------------------------------
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

    const livros = livrosResponse.data || [];
    const livrosBusca = livrosBuscaResponse.data || [];

    // Combinar e ordenar os livros alfabeticamente pel título
    const allBooks = [...livros, ...livrosBusca];

    const userDataElement = document.getElementById("bookCatalog");
    userDataElement.innerHTML = "";

    // -------------------------------------------------------
    // -------------------------------------------------------
    // Função para renderizar livros com base em um filtro
    function renderBooks(filter) {
      userDataElement.innerHTML = "";
      allBooks.forEach((livro) => {
        if (filter === "all" || livro.finalizado === filter) {
          const userDiv = document.createElement("div");
          userDiv.classList.add("livro");

          // Verificar se o livro vem da tabela "livros" ou "livros_busca"
          const genero = livro.serie || livro.genero || "Gênero não disponível";
          const ano = livro.ano || livro.data || "Ano não disponível";

          userDiv.innerHTML = `
            <p><strong>Livro:</strong> ${livro.livro}</p>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p><strong>Gênero:</strong> ${genero}</p>
            <p><strong>Ano:</strong> ${ano}</p>
            <p class="finalizado"><strong>Finalizado:</strong> ${livro.finalizado}</p>
          `;

          // Botão de excluir
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "x";
          deleteButton.classList.add("delete-button");
          deleteButton.addEventListener("click", async () => {
            if (livro.hasOwnProperty("serie") || livro.hasOwnProperty("ano")) {
              //Excluir da tabela "livros"
              await deleteBook(livro.id);
            } else {
              //Excluir da tabela livros_busca
              await deleteBookSearch(livro.id);
            }
            displayData();
          });

          userDiv.appendChild(deleteButton);
          userDataElement.appendChild(userDiv);
        }
      });
    }

    //Renderizar todos os livros ao carregar a página
    renderBooks("all");

    // -------------------------------------------------------
    // -------------------------------------------------------
    // Função para filtrar livros com base no status
    window.filterBooksByStatus = function (status) {
      let filter;
      switch (status) {
        case "finalizado":
          filter = "Sim";
          break;
        case "nao_finalizado":
          filter = "Não";
          break;
        case "em_andamento":
          filter = "Em andamento";
          break;
        default:
          filter = "all";
      }
      renderBooks(filter);
    };

    // Ordenação alfabética dos livros A-Z
    document.getElementById("sortAZ").addEventListener("click", () => {
      allBooks.sort((a, b) => a.livro.localeCompare(b.livro));
      renderBooks(window.currentFilter || "all");
    });

    // Ordenação por Autor A-Z
    document.getElementById("sortAutorAZ").addEventListener("click", () => {
      allBooks.sort((a, b) => a.autor.localeCompare(b.autor));
      renderBooks(window.currentFilter || "all");
    });

    // Ordem por Gênero A-Z
    document.getElementById("sortGenderAZ").addEventListener("click", () => {
      allBooks.sort((a, b) => {
        const genreA = a.serie || a.genero || "";
        const genreB = b.serie || b.genero || "";
        return genreA.localeCompare(genreB);
      });
      renderBooks(window.currentFilter || "all");
    });
  } catch (error) {
    console.error("Erro ao carregar dados do Supabase", error.message);
  }
}

// -------------------------------------------------------
// -------------------------------------------------------
// Função para contar a quantidade de livros marcados como "Sim" em livros_busca e livros
async function countBooksRead() {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

    // Consulta para contar os livros marcados como "Sim" na tabela livros_busca
    const { data: dataLivrosBusca, error: errorLivrosBusca } = await supabase
      .from("livros_busca")
      .select("livro")
      .eq("user_id", user.id)
      .eq("finalizado", "Sim");

    if (errorLivrosBusca) {
      throw errorLivrosBusca;
    }

    // Consulta para contar os livros marcados como "Sim" na tabela livros
    const { data: dataLivros, error: errorLivros } = await supabase
      .from("livros")
      .select("livro")
      .eq("user_id", user.id)
      .eq("finalizado", "Sim");

    if (errorLivros) {
      throw errorLivros;
    }

    // Somar os resultados das duas consultas
    const countLivrosBusca = dataLivrosBusca ? dataLivrosBusca.length : 0;
    const countLivros = dataLivros ? dataLivros.length : 0;
    const totalCount = countLivrosBusca + countLivros;

    return totalCount;
  } catch (error) {
    console.error("Erro ao contar livros lidos", error.message);
    throw error;
  }
}

// Função para mostrar o diálogo
function showDialog(count) {
  const dialog = document.getElementById("booksReadDialog");
  const dialogContent = document.getElementById("booksReadCount");
  dialogContent.textContent = `Você leu ${count} livro(s).`;
  dialog.showModal();

  // Fechar o diálogo ao clicar no botão 'Fechar'
  const closeButton = document.getElementById("closeDialog");
  closeButton.onclick = function () {
    dialog.close();
  };
}

// Event listener para o botão "Livros lidos"
document
  .querySelector(".countBooksRead")
  .addEventListener("click", async () => {
    try {
      const count = await countBooksRead();
      showDialog(count);
    } catch (error) {
      console.error(
        "Erro ao obter estatísticas de livros lidos",
        error.message
      );
    }
  });

// -------------------------------------------------------
// -------------------------------------------------------
// Função para contar a quantidade de livros lidos por autor
async function countBooksReadByAuthor() {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

    // Consulta para obter todos os livros marcados como "Sim" na tabela livros_busca
    const { data: livrosBusca, error: errorLivrosBusca } = await supabase
      .from("livros_busca")
      .select("autor")
      .eq("user_id", user.id)
      .eq("finalizado", "Sim");

    if (errorLivrosBusca) {
      throw errorLivrosBusca;
    }

    // Consulta para obter todos os livros marcados como "Sim" na tabela livros
    const { data: livros, error: errorLivros } = await supabase
      .from("livros")
      .select("autor")
      .eq("user_id", user.id)
      .eq("finalizado", "Sim");

    if (errorLivros) {
      throw errorLivros;
    }

    // Função para contar livros lidos por autor
    const countBooksByAuthor = (livrosData) => {
      const count = {};
      livrosData.forEach((livro) => {
        const autor = livro.autor || "Autor não especificado";
        if (!count[autor]) {
          count[autor] = 1;
        } else {
          count[autor]++;
        }
      });
      return count;
    };

    // Combinar e contar os resultados das duas consultas
    const booksBuscaCount = countBooksByAuthor(livrosBusca || []);
    const booksCount = countBooksByAuthor(livros || []);

    // Combinar os resultados das duas consultas
    const resultsByAuthor = {};
    for (const autor in booksBuscaCount) {
      if (resultsByAuthor[autor]) {
        resultsByAuthor[autor] += booksBuscaCount[autor];
      } else {
        resultsByAuthor[autor] = booksBuscaCount[autor];
      }
    }

    for (const autor in booksCount) {
      if (resultsByAuthor[autor]) {
        resultsByAuthor[autor] += booksCount[autor];
      } else {
        resultsByAuthor[autor] = booksCount[autor];
      }
    }

    // Ordenar os autores
    const sortedAuthors = Object.keys(resultsByAuthor).sort();

    //  Preparar mensagem para o dialog
    let dialogMessage = "Livros lidos por autor:\n\n";
    sortedAuthors.forEach((autor) => {
      dialogMessage += `${autor}: ${resultsByAuthor[autor]} livro(s)\n`;
    });

    // Exibir os resultados via dialog
    const dialog = document.getElementById("resultDialog");
    const messageElement = document.getElementById("resultMessage");
    messageElement.textContent = dialogMessage;
    dialog.showModal();
  } catch (error) {
    console.error("Erro ao contar livros lidos por autor", error.message);
    throw error;
  }
}

// Event listener para o botão "Livros lidos por autor"
document
  .querySelector(".countBooksReadByAuthor")
  .addEventListener("click", async () => {
    try {
      await countBooksReadByAuthor();
    } catch (error) {
      console.error(
        "Erro ao exibir estatísticas de livros lidos por autor",
        error.message
      );
    }
  });

// Event listener para fechar o dialog
document.getElementById("closeResultDialog").addEventListener("click", () => {
  const dialog = document.getElementById("resultDialog");
  dialog.close();
});

// Adiciona um evento para fechar o diálogo ao clicar fora dele (opcional)
document.getElementById("resultDialog").addEventListener("click", (event) => {
  if (event.target === document.getElementById("resultDialog")) {
    document.getElementById("resultDialog").close();
  }
});

// -------------------------------------------------------
// -------------------------------------------------------
// Função para contar a quantidade de livros lidos por genero
async function countBooksFinishedByGenre() {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

    // Consulta para obter todos os livros marcados como "Sim" na tabela livros_busca
    const { data: livrosBusca, error: errorLivrosBusca } = await supabase
      .from("livros_busca")
      .select("genero")
      .eq("user_id", user.id)
      .eq("finalizado", "Sim");

    if (errorLivrosBusca) {
      throw errorLivrosBusca;
    }

    // Consulta para obter todos os livros marcados como "Sim" na tabela livros
    const { data: livros, error: errorLivros } = await supabase
      .from("livros")
      .select("serie")
      .eq("user_id", user.id)
      .eq("finalizado", "Sim");

    if (errorLivros) {
      throw errorLivros;
    }

    // Função para contar livros finalizados por gênero
    const countBooksByGenre = (livrosData, colunaGenero) => {
      const count = {};
      livrosData.forEach((livro) => {
        const genero = livro[colunaGenero] || "Gênero não especificado";
        if (!count[genero]) {
          count[genero] = 1;
        } else {
          count[genero]++;
        }
      });
      return count;
    };

    // Contagem de livros finalizados por gênero nas duas tabelas
    const booksBuscaCount = countBooksByGenre(livrosBusca || [], "genero");
    const booksCount = countBooksByGenre(livros || [], "serie");

    // Combinar os resultados das duas consultas
    const resultsByGenre = { ...booksBuscaCount };
    for (const genero in booksCount) {
      if (resultsByGenre[genero]) {
        resultsByGenre[genero] += booksCount[genero];
      } else {
        resultsByGenre[genero] = booksCount[genero];
      }
    }

    // Ordenar os gêneros
    const sortedGenres = Object.keys(resultsByGenre).sort();

    // Preparar mensagem para o dialog
    let dialogMessage = "Livros finalizados por gênero:\n\n";
    sortedGenres.forEach((genero) => {
      dialogMessage += `${genero}: ${resultsByGenre[genero]} livro(s)\n`;
    });

    // Exibir os resultados via dialog
    const dialog = document.getElementById("genreResultDialog");
    const messageElement = document.getElementById("genreResultMessage");
    messageElement.textContent = dialogMessage;
    dialog.showModal();
  } catch (error) {
    console.error(
      "Erro ao contar livros finalizados por gênero",
      error.message
    );
    throw error;
  }
}

// Event listener para o botão "Livros finalizados por gênero"
document
  .querySelector(".countBooksFinishedByGenre")
  .addEventListener("click", async () => {
    try {
      await countBooksFinishedByGenre();
    } catch (error) {
      console.error(
        "Erro ao exibir estatísticas de livros finalizados por gênero",
        error.message
      );
    }
  });

// Event listener para fechar o dialog
document
  .getElementById("closeGenreResultDialog")
  .addEventListener("click", () => {
    const dialog = document.getElementById("genreResultDialog");
    dialog.close();
  });

// Adiciona um evento para fechar o diálogo ao clicar fora dele (opcional)
document
  .getElementById("genreResultDialog")
  .addEventListener("click", (event) => {
    if (event.target === document.getElementById("genreResultDialog")) {
      document.getElementById("genreResultDialog").close();
    }
  });

// -------------------------------------------------------
// -------------------------------------------------------
// Função para mudar o status de um livro

// -------------------------------------------------------
// -------------------------------------------------------
// Função para deletar um livro da tabela "livros"
async function deleteBook(id) {
  try {
    const { error } = await supabase.from("livros").delete().eq("id", id);
    if (error) throw error;
    console.log("Livro excluído com sucesso");
  } catch (error) {
    console.error("Erro ao excluir livro", error.message);
  }
}

// Função para deletar um livro da tabela "livros_busca"
async function deleteBookSearch(id) {
  try {
    const { error } = await supabase.from("livros_busca").delete().eq("id", id);
    if (error) throw error;
    console.log("Livro excluído com sucesso");
  } catch (error) {
    console.error("Erro ao excluir livro", error.message);
  }
}

// Inicializar a exibição dos dados
displayData();
// -------------------------------------------------------
// -------------------------------------------------------
