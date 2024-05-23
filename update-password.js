// Inicialize o Supabase com as credenciais do seu projeto
const supabaseUrl = "https://uyxbhreygsckfskebocj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGJocmV5Z3Nja2Zza2Vib2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjkxMDgsImV4cCI6MjAyODM0NTEwOH0.f4hfGh5xpT8-rFsfIOElu9msfxtHtpiz7HsIzjTYdko";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function updatePassword() {
  const newPassword = document.getElementById("new-password").value;

  if (!newPassword) {
    alert("Por favor, insira uma nova senha.");
    return;
  }

  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert("Erro ao redefinir senha: " + error.message);
    } else {
      alert("Senha redefinida com sucesso!");
      window.location.href = "login.html"; // Redirecionar para a página inicial após o sucesso
    }
  } catch (error) {
    console.error("Erro ao redefinir senha:", error.message);
    alert("Erro ao redefinir senha. Por favor, tente novamente.");
  }
}

// Mostrar opções da conta
document
  .getElementById("account-toggle")
  .addEventListener("click", function () {
    const accountOptions = document.getElementById("account-options");
    accountOptions.style.display =
      accountOptions.style.display === "none" ? "block" : "none";
  });

// Função para logout e redirecionamento
document
  .getElementById("logout")
  .addEventListener("click", async function (event) {
    event.preventDefault();
    await supabase.auth.signOut();
    window.location.href = "index.html";
  });

// Função para salvar os dados do formulário no Supabase
async function saveFormData(livro, serie, autor, ano, finalizado) {
  try {
    // Obter o usuário logado do Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      throw userError;
    }
    if (!user) {
      throw new Error("Usuário não está logado.");
    }

    // Inserir os dados na tabela 'livros' do Supabase
    const { data, error: insertError } = await supabase
      .from("livros")
      .insert([{ livro, serie, autor, ano, finalizado, user_id: user.id }]);
    if (insertError) {
      throw insertError;
    }
    console.log("Dados inseridos com sucesso", data);
    return data;
  } catch (error) {
    console.error("Erro ao inserir dados no Supabase", error.message);
    throw error;
  }
}

// Envio do formulário
document
  .getElementById("submitBtn")
  .addEventListener("click", async function () {
    // Coleta dos valores do formulário
    const livro = document.getElementById("livro").value;
    const serie = document.getElementById("serie").value;
    const autor = document.getElementById("autor").value;
    const ano = document.getElementById("ano").value;
    const finalizado = document.querySelector(
      'input[name="finalizado"]:checked'
    ).value;

    try {
      // Salvar os dados do formulário no Supabase
      await saveFormData(livro, serie, autor, ano, finalizado);
      alert("Dados enviados com sucesso");
      document.getElementById("bookForm").reset();
      // Atualiza a exibição de dados na página
      displayData();
    } catch (error) {
      alert("Ocorreu um erro ao enviar os dados");
      console.error(error);
    }
  });

// Função para carregar e exibir os dados do Supabase na página
async function displayData() {
  try {
    // Obter o usuário logado do Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) {
      throw userError;
    }
    if (!user) {
      throw new Error("Usuário não está logado");
    }

    // Obter os livros do usuário logado
    const { data: livros, error: livroError } = await supabase
      .from("livros")
      .select()
      .eq("user_id", user.id);
    if (livroError) {
      throw livroError;
    }

    const userDataElement = document.getElementById("bookCatalog");

    // Limpar o conteúdo anterior
    userDataElement.innerHTML = "";

    // Exibir os dados na página
    livros.forEach((livro) => {
      const userDiv = document.createElement("div");
      userDiv.classList.add("livro");
      userDiv.innerHTML = `<p><strong>Livro:</strong> ${livro.livro}</p><p><strong>Série:</strong> ${livro.serie}</p><p><strong>Autor:</strong> ${livro.autor}</p><p><strong>Ano:</strong> ${livro.ano}</p><p><strong>Finalizado:</strong> ${livro.finalizado}</p>`;

      // Adicionando botão de exclusão
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "x";
      deleteButton.className = "delete-button";
      deleteButton.addEventListener("click", async () => {
        try {
          // Excluir registro do Supabase
          const { error } = await supabase
            .from("livros")
            .delete()
            .eq("id", livro.id);
          if (error) {
            throw error;
          }

          // Atualizar a exibição dos dados na página após a exclusão
          displayData();
          console.log("Registro excluído com sucesso");
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

// Carregar dados ao iniciar a página
document.addEventListener("DOMContentLoaded", displayData);
