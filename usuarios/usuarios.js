class Usuario {
    constructor(id, nome, email, senha, data) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.data = data;
    }
}

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// Preenche a data de hoje ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
});

function gerarId() {
    return usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
}

document.getElementById("formUsuario").addEventListener("submit", function (e) {
    e.preventDefault();

    let nome = document.getElementById("nome").value.trim();
    let email = document.getElementById("email").value.trim();
    let senha = document.getElementById("senha").value;
    let data = document.getElementById("data").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um endereço de e-mail válido.");
        return;
    }

    if (usuarios.some(u => u.email === email)) {
        alert("Este e-mail já está cadastrado!");
        return;
    }

    let usuario = new Usuario(gerarId(), nome, email, senha, data);
    usuarios.push(usuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    render();

    this.reset();
    // Restaura a data de hoje após limpar o formulário
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
});

function render() {
    let tabela = document.getElementById("tabelaUsuarios");
    tabela.innerHTML = "";

    usuarios.forEach((u, index) => {
        let dataFormatada = new Date(u.data + 'T00:00:00').toLocaleDateString('pt-BR');

        tabela.innerHTML += `
            <tr>
                <td>${u.id}</td>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${dataFormatada}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(index) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        usuarios.splice(index, 1);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        render();
    }
}

render();