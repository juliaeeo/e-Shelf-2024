// Inicialize o Supabase com as credenciais do seu projeto
const supabaseUrl = "https://uyxbhreygsckfskebocj.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGJocmV5Z3Nja2Zza2Vib2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI3NjkxMDgsImV4cCI6MjAyODM0NTEwOH0.f4hfGh5xpT8-rFsfIOElu9msfxtHtpiz7HsIzjTYdko";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Função para redefinir senha do usuário
async function resetPassword() {
  const email = document.getElementById("reset-email").value;

  try {
    // Enviando link de redefinição de senha para o email fornecido
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        "https://juliaeeo.github.io/e-Shelf-2024/redefinir-senha.html",
    });
    // Verificando se houve erro no envio
    if (error) {
      alert("Erro ao enviar link de redefinição: " + error.message);
    } else {
      alert("Link de redefinição de senha enviado para " + email);
    }
  } catch (error) {
    alert("Erro ao redefinir senha. Por favor, tente novamente.");
  }
}
