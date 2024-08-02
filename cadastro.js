// // Inicialize o Supabase com as credenciais do seu projeto
const supabaseUrl = "https://uyxbhreygsckfskebocj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGJocmV5Z3Nja2Zza2Vib2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjkxMDgsImV4cCI6MjAyODM0NTEwOH0.f4hfGh5xpT8-rFsfIOElu9msfxtHtpiz7HsIzjTYdko";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// //////////////////////////////////////////
// // Controle do registro de usuário
// ///////////////////////////////////////////

//Função para registrar um novo usuário
async function registerUser() {
  //Coletando dados do formulário
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    //Criando o usuário no Supabase
    const { user, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "https://juliaeeo.github.io/e-Shelf-2024/",
      },
    });

    //Verificando se houve erro no registro
    if (error) {
      alert("Erro ao registrar usuário: " + error.message);
    } else {
      alert(
        "Usuário registrado com sucesso. Verifique seu email para confirmar seu cadastro e em seguida faça o seu login."
      );
      //Redirecionando para a página login.html após o sucesso do registro
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("Erro ao registrar usuário: ", error.message);
    alert("Erro ao registrar usuário. Por favor, tente novamente mais tarde.");
  }
}
