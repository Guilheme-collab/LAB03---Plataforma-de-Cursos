class Modulo {
    constructor(id, curso, titulo, ordem) {
        this.id = id;
        this.curso = curso;
        this.titulo = titulo;
        this.ordem = ordem;
    }
}

let modulos = JSON.parse(localStorage.getItem("modulos")) || [];
let cursos = JSON.parse(localStorage.getItem("cursos")) || [];

function gerarId() {
    return modulos.length > 0 ? Math.max(...modulos.map(m => m.id)) + 1 : 1;
}

function carregarCursos() {
    let select = document.getElementById("curso");
    let btnSubmit = document.querySelector("#formModulo button");

    if (cursos.length === 0) {
        btnSubmit.disabled = true;
        select.innerHTML = `<option>Nenhum curso cadastrado</option>`;
        return;
    }

    select.innerHTML = "";
    cursos.forEach(c => {
        select.innerHTML += `<option value="${c.id}">${c.titulo}</option>`;
    });
}

document.getElementById("formModulo").addEventListener("submit", function (e) {
    e.preventDefault();

    let cursoVal = document.getElementById("curso").value;
    let tituloVal = document.getElementById("titulo").value.trim();
    let ordemVal = parseInt(document.getElementById("ordem").value);

    if (ordemVal <= 0 || isNaN(ordemVal)) {
        alert("A ordem do módulo deve ser um número maior que zero.");
        return;
    }

    let modulo = new Modulo(gerarId(), cursoVal, tituloVal, ordemVal);
    modulos.push(modulo);
    localStorage.setItem("modulos", JSON.stringify(modulos));

    render();
    document.getElementById("titulo").value = "";
    document.getElementById("ordem").value = "";
});

function render() {
    let tabela = document.getElementById("tabelaModulos");
    tabela.innerHTML = "";

    modulos.forEach((m, index) => {
        let cursoObj = cursos.find(c => c.id == m.curso);

        tabela.innerHTML += `
            <tr>
                <td>${m.id}</td>
                <td>${cursoObj ? cursoObj.titulo : 'Curso Excluído'}</td>
                <td>${m.titulo}</td>
                <td>${m.ordem}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(index) {
    if (confirm("Deseja remover este módulo?")) {
        modulos.splice(index, 1);
        localStorage.setItem("modulos", JSON.stringify(modulos));
        render();
    }
}

carregarCursos();
render();