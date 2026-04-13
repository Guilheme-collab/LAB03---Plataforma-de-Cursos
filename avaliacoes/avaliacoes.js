class Avaliacao {
    constructor(id, usuario, curso, nota, comentario, data) {
        this.id = id;
        this.usuario = usuario;
        this.curso = curso;
        this.nota = nota;
        this.comentario = comentario;
        this.data = data;
    }
}

let avaliacoes = JSON.parse(localStorage.getItem("avaliacoes")) || [];
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let cursos = JSON.parse(localStorage.getItem("cursos")) || [];

function gerarId() {
    return avaliacoes.length > 0 ? Math.max(...avaliacoes.map(a => a.id)) + 1 : 1;
}

function carregar() {
    let selectUsuario = document.getElementById("usuario");
    let selectCurso = document.getElementById("curso");
    let btnSubmit = document.querySelector("#formAvaliacao button");

    if (usuarios.length === 0 || cursos.length === 0) {
        btnSubmit.disabled = true;
        selectUsuario.innerHTML = `<option>Faltam dados</option>`;
        selectCurso.innerHTML = `<option>Faltam dados</option>`;
        return;
    }

    selectUsuario.innerHTML = "";
    selectCurso.innerHTML = "";

    usuarios.forEach(u => selectUsuario.innerHTML += `<option value="${u.id}">${u.nome}</option>`);
    cursos.forEach(c => selectCurso.innerHTML += `<option value="${c.id}">${c.titulo}</option>`);
    
    // Preenche a data de hoje
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
}

document.getElementById("formAvaliacao").addEventListener("submit", function(e) {
    e.preventDefault();

    let usuarioVal = document.getElementById("usuario").value;
    let cursoVal = document.getElementById("curso").value;
    let notaVal = parseInt(document.getElementById("nota").value);
    let comentarioVal = document.getElementById("comentario").value.trim();
    let dataVal = document.getElementById("data").value;

    let jaAvaliou = avaliacoes.some(a => a.usuario == usuarioVal && a.curso == cursoVal);
    if (jaAvaliou) {
        alert("Este usuário já enviou uma avaliação para este curso.");
        return;
    }

    let avaliacao = new Avaliacao(gerarId(), usuarioVal, cursoVal, notaVal, comentarioVal, dataVal);
    avaliacoes.push(avaliacao);
    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));

    render();
    
    this.reset();
    // Restaura a data de hoje
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
});

function render() {
    let tabela = document.getElementById("tabelaAvaliacoes");
    tabela.innerHTML = "";

    avaliacoes.forEach((a, i) => {
        let usuarioObj = usuarios.find(u => u.id == a.usuario);
        let cursoObj = cursos.find(c => c.id == a.curso);
        let dataFormatada = new Date(a.data + 'T00:00:00').toLocaleDateString('pt-BR');

        tabela.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${usuarioObj ? usuarioObj.nome : 'Excluído'}</td>
                <td>${cursoObj ? cursoObj.titulo : 'Excluído'}</td>
                <td>⭐ ${a.nota}</td>
                <td>${a.comentario || '-'}</td>
                <td>${dataFormatada}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${i})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(i) {
    if (confirm("Remover avaliação?")) {
        avaliacoes.splice(i, 1);
        localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
        render();
    }
}

carregar();
render();