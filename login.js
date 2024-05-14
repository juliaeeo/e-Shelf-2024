// // Inicialize o Supabase com as credenciais do seu projeto
const supabaseUrl = "https://uyxbhreygsckfskebocj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGJocmV5Z3Nja2Zza2Vib2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjkxMDgsImV4cCI6MjAyODM0NTEwOH0.f4hfGh5xpT8-rFsfIOElu9msfxtHtpiz7HsIzjTYdko";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

////////////////////////////////////////////////////////////////////////////////////////////////
//Adiciona um evento de clique à seta do login para alternar a visibilidade das opções da conta
///////////////////////////////////////////////////////////////////////////////////////
document
  .getElementById("account-toggle")
  .addEventListener("click", function () {
    let accountOptions = document.getElementById("account-options");
    //Se as opções de conta estão visíveis, esconde-as. Caso contrário, mostra-as
    if (accountOptions.style.display === "block") {
      accountOptions.style.display = "none";
    } else {
      accountOptions.style.display = "block";
    }
  });

// //////////////////////////////////////////
// // Controle do login de usuário
// ///////////////////////////////////////////

//Função para fazer login do usuário
async function loginUser() {
  //Coletando dados do formulário
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    //Fazendo login do usário no Supabase
    const { user, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    //Verificando se houve erro no login
    if (error) {
      alert("Erro ao fazer login: " + error.message);
    } else {
      //Redirecionando para a página books.html após o sucesso do login
      window.location.href = "books.html";
    }
  } catch (error) {
    console.error("Erro ao fazer login:", error.message);
    alert(
      "Erro ao fazer login. Por favor, verifique seu email e senha e tente novamente."
    );
  }
}
