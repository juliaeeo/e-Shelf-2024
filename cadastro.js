// // Inicialize o Supabase com as credenciais do seu projeto
const supabaseUrl = "https://uyxbhreygsckfskebocj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGJocmV5Z3Nja2Zza2Vib2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjkxMDgsImV4cCI6MjAyODM0NTEwOH0.f4hfGh5xpT8-rFsfIOElu9msfxtHtpiz7HsIzjTYdko";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

//////////////////////////////////////////
// Controle do registro de usuário
///////////////////////////////////////////

//Função para registrar um novo usuário
async function signUp(email, password) {
  try {
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      throw new Error("Erro ao registrar: " + error.message);
    } else {
      alert(
        "Usuário registrado com sucesso: " +
          email +
          "Verifique a confirmação em seu email."
      );
      return user;
    }
  } catch (error) {
    alert("Erro ao registrar: " + error.message);
    console.error("Erro ao registrar:", error.message);
    return null;
  }
}

// Função para chamar a função signUp quando o usuário clica em "Registrar"
async function registerUser() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const user = await signUp(email, password);
    if (user) {
      window.location.href = "books.html";
    }
  } catch (error) {
    if (error.message.includes("Email rate limit exceeded")) {
      alert(
        "Ocorreu um problema ao enviar o e-mail de confirmação. Por favor, tente novamente mais tarde."
      );
    } else {
      alert("Erro ao registrar: " + error.message);
    }
  }
}
