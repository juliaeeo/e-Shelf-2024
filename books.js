// Para inserir dados no formulário e exibir o catálogo de livros

// // Inicialize o Supabase com as credenciais do seu projeto
const supabaseUrl = "https://uyxbhreygsckfskebocj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGJocmV5Z3Nja2Zza2Vib2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjkxMDgsImV4cCI6MjAyODM0NTEwOH0.f4hfGh5xpT8-rFsfIOElu9msfxtHtpiz7HsIzjTYdko";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função para salvar os dados do formulário no Supabase
async function saveFormData(livro, serie, autor, ano, finalizado) {
  try {
    //Insere os dados na tabela 'livros' do Supabase
    const { data, error } = await supabase
      .from("livros")
      .insert([{ livro, serie, autor, ano, finalizado }]);
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

// Envio do formulário
document
  .getElementById("bookForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    // Coleta dos valores do formulário
    const livro = document.getElementById("livro").value;
    const serie = document.getElementById("serie").value;
    const autor = document.getElementById("autor").value;
    const ano = document.getElementById("ano").value;
    const finalizado = document.querySelector(
      'input[name="finalizado"]:checked'
    ).value;

    try {
      await saveFormData(livro, serie, autor, ano, finalizado);
      alert("Dados enviados com sucesso");
      document.getElementById("bookForm").reset();
    } catch (error) {
      alert("Ocorreu um erro ao enviar os dados");
    }
  });

//Função para carregar e exibir os dados do Supabase na página
async function displayData() {
  try {
    const { data: livros, error } = await supabase.from("livros").select();
    if (error) {
      throw error;
    }

    const userDataElement = document.getElementById("bookCatalog");

    //Limpar o conteúdo anterior
    userDataElement.innerHTML = "";

    //Exibir os dados na página
    livros.forEach((livro) => {
      const userDiv = document.createElement("div");
      userDiv.classList.add("livro");
      userDiv.innerHTML = `<p><strong>Livro:</strong> ${livro.livro}</p><p><strong>Série:</strong> ${livro.serie}</p><p><strong>Autor:</strong> ${livro.autor}</p><p><strong>Ano:</strong> ${livro.ano}</p><p><strong>Finalizado:</strong> ${livro.finalizado}</p>`;

      //Adicionando botão de exclusão
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Excluir";
      deleteButton.addEventListener("click", async () => {
        try {
          //Excluir registro do Supabase
          const { error } = await supabase
            .from("livros")
            .delete()
            .eq("id", livro.id);
          if (error) {
            throw error;
          }

          //Atualizar a exibição dos dados na página após a exclusão
          displayData();
          console.log("Registro excluido com sucesso");
        } catch (error) {
          console.error("Erro ao excluir registro", error.message);
        }
      });

      userDiv.appendChild(deleteButton);
      userDataElement.appendChild(userDiv);
    });
  } catch (error) {
    console.error("Erro ao carregar dados do Supabase".error.message);
  }
}

// Chamar a função para exibir os dados ao carregar a página
displayData();

// Rolar suavemente para a seção do catálogo de livros quando clicar na palavra "Catálogo"
document.getElementById("catalogLink").addEventListener("click", function () {
  document.getElementById("bookCatalog").scrollIntoView({ behavior: "smooth" });
});
