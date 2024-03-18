function submitForm(event) {
  event.preventDefault();

  //Capturando os valores do formulário
  let livro = document.getElementById("livro").value;
  let serie = document.getElementById("serie").value;
  let autor = document.getElementById("autor").value;
  let ano = document.getElementById("ano").value;
  let finalizado = document.querySelector(
    'input[name="finalizado"]:checked'
  ).value;

  //Construindo as informações para o catálogo

  let bookInfo =
    "<div class='book'>" +
    "<p><strong>Livro:</strong> " +
    livro +
    "</p>" +
    "<p><strong>Série:</strong> " +
    serie +
    "</p>" +
    "<p><strong>Autor:</strong> " +
    autor +
    "</p>" +
    "<p><strong>Ano de Publicação:</strong> " +
    ano +
    "</p>" +
    "<p><strong>Finalizado:</strong> " +
    finalizado +
    "</p>";

  //Mostrando as informações no Catálogo
  document.getElementById("bookCatalog").innerHTML += bookInfo;

  //Limpando os campos do formulário
  document.getElementById("bookForm").reset();
}

// Adicionando eventlistener a submissão do formulário
document.getElementById("bookForm").addEventListener("submit", submitForm);
