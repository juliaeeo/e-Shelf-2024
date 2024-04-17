// Controle do login e registro de usuário

// // Inicialize o Supabase com as credenciais do seu projeto
const supabaseUrl = "https://uyxbhreygsckfskebocj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGJocmV5Z3Nja2Zza2Vib2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjkxMDgsImV4cCI6MjAyODM0NTEwOH0.f4hfGh5xpT8-rFsfIOElu9msfxtHtpiz7HsIzjTYdko";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

//Função para registro de usuário
// window.register = register;
async function register() {
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([{ email, password }]);

    if (error) {
      throw error;
    }

    alert("Usuário registrado com sucesso!");

    // Redirecionar para outra página após o login bem-sucedido
    window.location.href = "login.html";

    // Limpar os campos após o registro bem-sucedido
    document.getElementById("register-email").value = "";
    document.getElementById("register-password").value = "";
  } catch (error) {
    alert("Erro ao registrar usuário. Por favor, tente novamente.");
  }
}

//Função para login de usuário

async function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    // Consulta ao Supabase para verificar se o usuário existe na tabela 'usuarios'
    const { data, error } = await supabase
      .from("usuarios")
      .select()
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      alert("Login realizado com sucesso!");
      // Redirecionar para outra página após o login bem-sucedido
      window.location.href = "login.html";
    } else {
      alert("Credenciais inválidas. Por favor, verifique seu email e senha.");
    }
    // Limpar os campos após o registro bem-sucedido
    document.getElementById("login-email").value = "";
    document.getElementById("login-password").value = "";
  } catch (error) {
    alert("Erro ao fazer login. Por favor, tente novamente.");
  }
}
