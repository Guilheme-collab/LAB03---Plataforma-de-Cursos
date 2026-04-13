class Matricula {
    constructor(id, usuario, curso, data) {
        this.id = id;
        this.usuario = usuario;
        this.curso = curso;
        this.data = data;
    }
}

let matriculas = JSON.parse(localStorage.getItem("matriculas")) || [];
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let cursos = JSON.parse(localStorage.getItem("cursos")) || [];

function gerarId() {
    return matriculas.length > 0 ? Math.max(...matriculas.map(m => m.id)) + 1 : 1;
}

function carregarSelects() {
    let selectUsuario = document.getElementById("usuario");
    let selectCurso = document.getElementById("curso");
    let btnSubmit = document.querySelector("#formMatricula button");

    if (usuarios.length === 0 || cursos.length === 0) {
        btnSubmit.disabled = true;
        selectUsuario.innerHTML = `<option>Sem dados suficientes</option>`;
        selectCurso.innerHTML = `<option>Sem dados suficientes</option>`;
        return;
    }

    selectUsuario.innerHTML = "";
    selectCurso.innerHTML = "";

    usuarios.forEach(u => selectUsuario.innerHTML += `<option value="${u.id}">${u.nome}</option>`);
    cursos.forEach(c => selectCurso.innerHTML += `<option value="${c.id}">${c.titulo}</option>`);

    // Preenche a data de hoje
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
}

document.getElementById("formMatricula").addEventListener("submit", function (e) {
    e.preventDefault();

    let usuarioVal = document.getElementById("usuario").value;
    let cursoVal = document.getElementById("curso").value;
    let dataVal = document.getElementById("data").value;

    let matriculaExistente = matriculas.some(m => m.usuario == usuarioVal && m.curso == cursoVal);
    if (matriculaExistente) {
        alert("Este usuário já está matriculado neste curso!");
        return;
    }

    let matricula = new Matricula(gerarId(), usuarioVal, cursoVal, dataVal);
    matriculas.push(matricula);
    localStorage.setItem("matriculas", JSON.stringify(matriculas));

    render();

    this.reset();
    // Restaura a data de hoje
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
});

function render() {
    let tabela = document.getElementById("tabelaMatriculas");
    tabela.innerHTML = "";

    matriculas.forEach((m, index) => {
        let usuarioObj = usuarios.find(u => u.id == m.usuario);
        let cursoObj = cursos.find(c => c.id == m.curso);
        let dataFormatada = new Date(m.data + 'T00:00:00').toLocaleDateString('pt-BR');

        tabela.innerHTML += `
            <tr>
                <td>${m.id}</td>
                <td>${usuarioObj ? usuarioObj.nome : 'Excluído'}</td>
                <td>${cursoObj ? cursoObj.titulo : 'Excluído'}</td>
                <td>${dataFormatada}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(index) {
    if (confirm("Cancelar esta matrícula?")) {
        matriculas.splice(index, 1);
        localStorage.setItem("matriculas", JSON.stringify(matriculas));
        render();
    }
}

carregarSelects();
render();