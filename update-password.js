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
