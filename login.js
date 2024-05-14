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

//////////////////////////////////////////
// Controle do login de usuário
///////////////////////////////////////////

//Função para fazer login
async function signIn(email, password) {
  try {
    //Verifica se o usuário existe antes de fazer login
    const { data: userExists, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError) {
      throw new Error("Erro ao verificar o usuário: " + userError.message);
    }

    if (!userExists) {
      throw new Error("Usuário não encontrado.");
    }

    //Faz login apenas se o usuário estiver registrado

    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });
    if (error) {
      throw new Error("Erro ao fazer login: " + error.message);
    } else {
      console.log("Login bem sucedido:", user);
      return user;
    }
  } catch (error) {
    alert(error.message);
    console.error("Erro ao fazer login:", error.message);
    return null;
  }
}

// Função para chamar a função signIn quando o usuário clica em "Entrar"
function loginUser() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  signIn(email, password).then((user) => {
    if (user) {
      window.location.href = "books.html";
    }
  });
}
