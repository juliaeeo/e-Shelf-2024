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

// Javascript pros ícones de filtro, ordenação e estatística
document.addEventListener("DOMContentLoaded", function () {
  const filterButton = document.getElementById("filterButton");
  const sortButton = document.getElementById("sortButton");
  const sortAuthorButton = document.getElementById("sortAuthorButton");
  const sortGenreButton = document.getElementById("sortGenreButton");
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
// Inicialize o Supabase com as credenciais do seu projeto
// -------------------------------------------------------

const supabaseUrl = "https://uyxbhreygsckfskebocj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGJocmV5Z3Nja2Zza2Vib2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjkxMDgsImV4cCI6MjAyODM0NTEwOH0.f4hfGh5xpT8-rFsfIOElu9msfxtHtpiz7HsIzjTYdko";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// -------------------------------------------------------
// Chave da API do Google Books
// -------------------------------------------------------
const API_KEY = "AIzaSyByZueS-sEDclSmT-lL4NnJ0Iejwn-251I";

// Event listener for input fields to trigger search
document.getElementById("livro").addEventListener("input", searchBooks);
document.getElementById("autor").addEventListener("input", searchBooks);

// Event listener to clear search results when clicking outside
document.addEventListener("click", function (event) {
  const searchResults = document.getElementById("searchResults");
  if (
    !event.target.closest("#searchResults") &&
    !event.target.closest("#livro") &&
    !event.target.closest("#autor")
  ) {
    searchResults.innerHTML = "";
    searchResults.style.display = "none";
  }
});

// -------------------------------------------------------
// Função para buscar livros na API do Google Books
// -------------------------------------------------------

async function searchBooks(event) {
  const query = event.target.value;
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
// Função para exibir os resultados da busca
// -------------------------------------------------------
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
    listItem.addEventListener("click", () => fillFormInputs(book));
    resultsList.appendChild(listItem);
  });

  resultsList.style.display = "block";
}

// -------------------------------------------------------
// Função para preencher os campos do formulário
// -------------------------------------------------------
function fillFormInputs(book) {
  document.getElementById("livro").value = book.volumeInfo.title || "";
  document.getElementById("autor").value = book.volumeInfo.authors
    ? book.volumeInfo.authors.join(", ")
    : "";
  document.getElementById("serie").value = book.volumeInfo.categories
    ? book.volumeInfo.categories.join(", ")
    : "";
  document.getElementById("ano").value = book.volumeInfo.publishedDate
    ? new Date(book.volumeInfo.publishedDate).getFullYear().toString()
    : "";
  document.getElementById("searchResults").style.display = "none";
}

// -------------------------------------------------------
// Função para verificar a autenticação do usuário
// -------------------------------------------------------
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

// ------------------------------------------------------------
// Função para salvar os dados do formulário na tabela "livros"
// ------------------------------------------------------------

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
// Envio do formulário
// -------------------------------------------------------

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
      Toastify({
        text: "Dados enviados com sucesso!",
        duration: 3000,
        backgroundColor: "#34b991",
      }).showToast();

      document.getElementById("bookForm").reset();
      displayData();
    } catch (error) {
      alert("Ocorreu um erro ao enviar os dados");
      console.error(error);
    }
  });

// -------------------------------------------------------
// Limpeza do formulário ao clicar em "Limpar"
// -------------------------------------------------------

document.getElementById("cancelBtn").addEventListener("click", function () {
  document.getElementById("bookForm").reset();
});

// -------------------------------------------------------------
// Função para carregar e exibir os dados do Supabase na página
// ------------------------------------------------------------
let livros = [];

async function displayData() {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

    // Obter os livros do usuário logado da tabela "livros"
    const { data, error } = await supabase
      .from("livros")
      .select()
      .eq("user_id", user.id);

    if (error) throw error;

    livros = data || [];

    // Call renderBooks without filter
    renderBooks(window.currentFilter || "all");
  } catch (error) {
    console.error("Erro ao carregar dados do Supabase", error.message);
  }
}

// Função para renderizar livros com base em um filtro
function renderBooks(filter) {
  const userDataElement = document.getElementById("bookCatalog");
  userDataElement.innerHTML = "";

  // Apply filter
  const filteredLivros = livros.filter((livro) => {
    if (filter === "all") return true;
    return livro.finalizado === filter;
  });

  // Sort filtered livros
  filteredLivros.forEach((livro) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("livro");

    const genero = livro.serie || "Gênero não disponível";
    const ano = livro.ano || "Ano não disponível";

    userDiv.innerHTML = `
          <p><strong>Livro:</strong> ${livro.livro}</p>
          <p><strong>Autor:</strong> ${livro.autor}</p>
          <p><strong>Gênero:</strong> ${genero}</p>
          <p><strong>Ano:</strong> ${ano}</p>
          <p class="finalizado"><strong>Finalizado:</strong> ${
            livro.finalizado
          }</p>
          ${
            livro.emprestimo
              ? `<p class="emprestimo"><strong>Livro emprestado para:</strong> ${livro.emprestimo}</p>`
              : ""
          }
        `;

    // Botão compre agora quando o status for "não"
    if (livro.finalizado === "Não") {
      const buyButton = document.createElement("button");
      buyButton.textContent = "Comprar livro";
      buyButton.classList.add("buy-button");
      buyButton.addEventListener("click", () => {
        window.open("https://amzn.to/4cEFnSa", "_blank");
      });
      userDiv.appendChild(buyButton);
    }

    // Botão de excluir
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", async () => {
      await deleteBook(livro.id);
      displayData();
    });

    // Botão de editar
    const editButton = document.createElement("button");
    editButton.textContent = "✎"; // Icon for edit
    editButton.classList.add("edit-button");
    editButton.addEventListener("click", () => {
      editBook(livro);
    });

    // Botão de emprestar livro
    const lendButton = document.createElement("button");
    lendButton.textContent = "⇄ 📚";
    lendButton.classList.add("lend-button");

    lendButton.addEventListener("click", () => {
      lendBook(livro);
    });

    userDiv.appendChild(deleteButton);
    userDiv.appendChild(editButton);
    userDiv.appendChild(lendButton);
    userDataElement.appendChild(userDiv);
  });
}

// -------------------------------------------------------
// Função para excluir um livro da tabela "livros"
// -------------------------------------------------------
async function deleteBook(bookId) {
  // exibe a mensagem de confirmação
  const confirmation = confirm("Tem certeza que deseja apagar este livro?");

  // se o usuário cancelar, a função termina aqui
  if (!confirmation) return;

  try {
    const user = await checkUserAuthentication();
    if (!user) return;

    const { error } = await supabase
      .from("livros")
      .delete()
      .eq("id", bookId)
      .eq("user_id", user.id);

    if (error) {
      throw error;
    }

    // Exibe uma notificação de sucesso após a exclusão do livro
    Toastify({
      text: "Livro apagado com sucesso!",
      duration: 3000,
      backgroundColor: "rgb(245, 189, 85)", // Cor laranja
    }).showToast();

    console.log("Livro excluído com sucesso");
  } catch (error) {
    console.error("Erro ao excluir livro", error.message);
  }
}

// -------------------------------------------------------
// Função para editar o livro
// -------------------------------------------------------
async function editBook(livro) {
  const dialog = document.getElementById("edit-status-dialog");
  const confirmButton = document.getElementById("confirm-status-button");

  // Show the dialog
  dialog.showModal();

  // Add an event listener for the confirm button click
  confirmButton.addEventListener(
    "click",
    async () => {
      // Get the selected status from the dialog
      const form = dialog.querySelector("form");
      const formData = new FormData(form);
      const newStatus = formData.get("status");

      if (!newStatus) return; // If no status is selected, do nothing

      try {
        const user = await checkUserAuthentication();
        if (!user) return;

        // Update the status of the book
        const { error } = await supabase
          .from("livros")
          .update({ finalizado: newStatus })
          .eq("id", livro.id)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        console.log("Status atualizado com sucesso");
        alert("Status do livro atualizado com sucesso");
        displayData(); // Update the display of data
      } catch (error) {
        console.error("Erro ao atualizar status do livro", error.message);
        alert("Erro ao atualizar oname status do livro");
      } finally {
        dialog.close(); // Close the dialog
      }
    },
    { once: true }
  ); // Ensure the event listener is only called once
}

// -------------------------------------------------------
// Função para emprestar o livro
// -------------------------------------------------------
async function lendBook(livro) {
  const lendBookDialog = document.getElementById("lendBookDialog");
  const confirmButton = document.getElementById("confirmLendBookButton");
  const cancelButton = document.getElementById("cancelLendBookButton");
  const deleteLendButton = document.getElementById("deleteLendButton");
  const borrowerNameInput = document.getElementById("borrowerName");

  // Limpa todos os event listeners antigos para evitar múltiplas execuções
  confirmButton.replaceWith(confirmButton.cloneNode(true));
  cancelButton.replaceWith(cancelButton.cloneNode(true));
  deleteLendButton.replaceWith(deleteLendButton.cloneNode(true));

  // Pega os novos botões sem event listeners antigos
  const newConfirmButton = document.getElementById("confirmLendBookButton");
  const newCancelButton = document.getElementById("cancelLendBookButton");
  const newDeleteLendButton = document.getElementById("deleteLendButton");

  // Limpa o campo de texto do nome antes de abrir o modal
  borrowerNameInput.value = "";

  // Abre o modal
  lendBookDialog.showModal();

  // Adiciona um evento de clique ao botão de confirmar
  newConfirmButton.addEventListener(
    "click",
    async () => {
      const borrowerName = borrowerNameInput.value.trim();
      if (!borrowerName) {
        alert(
          "Por favor, insira o nome da pessoa que pegou o livro emprestado."
        );
        return; // Se o nome estiver vazio, não faça nada
      }

      try {
        const user = await checkUserAuthentication();
        if (!user) return;

        // Atualiza a coluna "emprestimo" do livro no Supabase
        const { error } = await supabase
          .from("livros")
          .update({ emprestimo: borrowerName })
          .eq("id", livro.id)
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        displayData();
      } catch (error) {
        console.error("Erro ao salvar o empréstimo", error.message);
      } finally {
        lendBookDialog.close(); // Fecha o modal
      }
    },
    { once: true }
  );

  // Adiciona um evento de clique ao botão de cancelar
  newCancelButton.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      lendBookDialog.close();
      borrowerNameInput.value = ""; // Limpa o campo de texto ao cancelar
    },
    { once: true }
  );

  // Excluir um empréstimo
  newDeleteLendButton.addEventListener(
    "click",
    async () => {
      borrowerNameInput.removeAttribute("required"); // Remove temporariamente o atributo required

      try {
        const user = await checkUserAuthentication();
        if (!user) return;

        // Remove o valor da coluna "emprestimo" no Supabase
        const { error } = await supabase
          .from("livros")
          .update({ emprestimo: null }) // Define como `null` para apagar o empréstimo
          .eq("id", livro.id)
          .eq("user_id", user.id);

        if (error) throw error;

        displayData();

        // Exibe uma notificação de sucesso após a exclusão do livro
        Toastify({
          text: "Empréstimo excluido com sucesso!",
          duration: 3000,
          backgroundColor: "rgb(11, 136, 167)",
        }).showToast();
      } catch (error) {
        console.error("erro ao excluir o empréstimo", error.message);
      } finally {
        lendBookDialog.close();
        borrowerNameInput.setAttribute("required", ""); // Restaura o atributo required
        borrowerNameInput.value = ""; // Limpa o campo de texto ao cancelar
      }
    },
    { once: true }
  );
}

// -------------------------------------------------------
// Função para filtrar livros com base no status
// -------------------------------------------------------
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
  window.currentFilter = filter; //save the current filter
  renderBooks(filter);
};

// Ordenação alfabética dos livros A-Z
document.getElementById("sortAZ").addEventListener("click", () => {
  livros.sort((a, b) => a.livro.localeCompare(b.livro));
  renderBooks(window.currentFilter || "all");
});

// Ordenação por Autor A-Z
document.getElementById("sortAutorAZ").addEventListener("click", () => {
  livros.sort((a, b) => a.autor.localeCompare(b.autor));
  renderBooks(window.currentFilter || "all");
});

// Ordem por Gênero A-Z
document.getElementById("sortGenderAZ").addEventListener("click", () => {
  livros.sort((a, b) => {
    const genreA = a.serie || a.genero || "";
    const genreB = b.serie || b.genero || "";
    return genreA.localeCompare(genreB);
  });
  renderBooks(window.currentFilter || "all");
});

// ---------------------------------------------------------------------------------------
// Função para contar a quantidade de livros marcados como "Sim" na tabela livros
// --------------------------------------------------------------------------------------
async function countBooksRead() {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

    // Consulta para contar os livros marcados como "Sim" na tabela livros
    const { data: dataLivros, error: errorLivros } = await supabase
      .from("livros")
      .select("livro")
      .eq("user_id", user.id)
      .eq("finalizado", "Sim");

    if (errorLivros) {
      throw errorLivros;
    }

    // Contar os livros finalizados
    const countLivros = dataLivros ? dataLivros.length : 0;

    return countLivros;
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

// ---------------------------------------------------------
// Função para contar a quantidade de livros lidos por autor
// ---------------------------------------------------------
async function countBooksReadByAuthor() {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

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

    // Contar livros lidos por autor
    const booksCount = countBooksByAuthor(livros || []);

    // Ordenar os autores
    const sortedAuthors = Object.keys(booksCount).sort();

    // Preparar mensagem para o dialog
    let dialogMessage = "Livros lidos por autor:\n\n";
    sortedAuthors.forEach((autor) => {
      dialogMessage += `${autor}: ${booksCount[autor]} livro(s)\n`;
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

// ----------------------------------------------------------
// Função para contar a quantidade de livros lidos por gênero
// ----------------------------------------------------------
async function countBooksFinishedByGenre() {
  try {
    const user = await checkUserAuthentication();
    if (!user) return;

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

    // Contagem de livros finalizados por gênero na tabela livros
    const booksCount = countBooksByGenre(livros || [], "serie");

    // Ordenar os gêneros
    const sortedGenres = Object.keys(booksCount).sort();

    // Preparar mensagem para o dialog
    let dialogMessage = "Livros finalizados por gênero:\n\n";
    sortedGenres.forEach((genero) => {
      dialogMessage += `${genero}: ${booksCount[genero]} livro(s)\n`;
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

// Carregar dados na inicialização
document.addEventListener("DOMContentLoaded", displayData);
