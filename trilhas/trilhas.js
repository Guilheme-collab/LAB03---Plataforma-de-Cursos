class Trilha {
    constructor(id, titulo, descricao, categoria, curso) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.categoria = categoria;
        this.curso = curso;
    }
}

let trilhas = JSON.parse(localStorage.getItem("trilhas")) || [];
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];
let cursos = JSON.parse(localStorage.getItem("cursos")) || [];

function gerarId() {
    return trilhas.length > 0 ? Math.max(...trilhas.map(t => t.id)) + 1 : 1;
}

function carregarSelects() {
    let selectCategoria = document.getElementById("categoria");
    let selectCurso = document.getElementById("curso");
    let btnSubmit = document.querySelector("#formTrilha button");

    // Tratativa: Verificar se existem dados prévios
    if (categorias.length === 0 || cursos.length === 0) {
        btnSubmit.disabled = true;
        alert("Atenção: Cadastre pelo menos uma Categoria e um Curso antes de criar uma Trilha.");
        return;
    }

    categorias.forEach(c => {
        selectCategoria.innerHTML += `<option value="${c.nome}">${c.nome}</option>`;
    });

    cursos.forEach(c => {
        selectCurso.innerHTML += `<option value="${c.titulo}">${c.titulo}</option>`;
    });
}

document.getElementById("formTrilha").addEventListener("submit", function (e) {
    e.preventDefault();

    let titulo = document.getElementById("titulo").value.trim();
    let descricao = document.getElementById("descricao").value.trim();
    let categoria = document.getElementById("categoria").value;
    let curso = document.getElementById("curso").value;

    let trilha = new Trilha(gerarId(), titulo, descricao, categoria, curso);
    trilhas.push(trilha);
    localStorage.setItem("trilhas", JSON.stringify(trilhas));

    render();
    this.reset();
});

function render() {
    let tabela = document.getElementById("tabelaTrilhas");
    tabela.innerHTML = "";

    trilhas.forEach((t, index) => {
        tabela.innerHTML += `
            <tr>
                <td>${t.id}</td>
                <td>${t.titulo}</td>
                <td>${t.categoria}</td>
                <td>${t.curso}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(index) {
    if (confirm("Deseja realmente remover esta trilha?")) {
        trilhas.splice(index, 1);
        localStorage.setItem("trilhas", JSON.stringify(trilhas));
        render();
    }
}

carregarSelects();
render();