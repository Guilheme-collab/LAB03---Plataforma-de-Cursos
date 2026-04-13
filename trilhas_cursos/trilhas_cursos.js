class TrilhaCurso {
    constructor(trilha, curso, ordem) {
        this.trilha = trilha;
        this.curso = curso;
        this.ordem = ordem;
    }
}

let dados = JSON.parse(localStorage.getItem("trilhas_cursos")) || [];
let trilhas = JSON.parse(localStorage.getItem("trilhas")) || [];
let cursos = JSON.parse(localStorage.getItem("cursos")) || [];

function carregar() {
    let selectTrilha = document.getElementById("trilha");
    let selectCurso = document.getElementById("curso");
    let btnSubmit = document.querySelector("#formTrilhaCurso button");

    if (trilhas.length === 0 || cursos.length === 0) {
        btnSubmit.disabled = true;
        selectTrilha.innerHTML = `<option>Sem dados disponíveis</option>`;
        selectCurso.innerHTML = `<option>Sem dados disponíveis</option>`;
        return;
    }

    trilhas.forEach(t => {
        selectTrilha.innerHTML += `<option value="${t.id}">${t.titulo}</option>`;
    });

    cursos.forEach(c => {
        selectCurso.innerHTML += `<option value="${c.id}">${c.titulo}</option>`;
    });
}

document.getElementById("formTrilhaCurso").addEventListener("submit", e => {
    e.preventDefault();

    let trilhaVal = document.getElementById("trilha").value;
    let cursoVal = document.getElementById("curso").value;
    let ordemVal = parseInt(document.getElementById("ordem").value);

    // Tratativa: Validação de Ordem
    if (ordemVal <= 0 || isNaN(ordemVal)) {
        alert("A ordem deve ser um número maior que zero.");
        return;
    }

    let obj = new TrilhaCurso(trilhaVal, cursoVal, ordemVal);
    dados.push(obj);
    localStorage.setItem("trilhas_cursos", JSON.stringify(dados));

    render();
    document.getElementById("ordem").value = ""; // Limpa apenas a ordem para facilitar múltiplos cadastros
});

function render() {
    let tabelaTrilhaCursos = document.getElementById("tabelaTrilhaCursos");
    tabelaTrilhaCursos.innerHTML = "";

    dados.forEach((d, i) => {
        let trilhaObj = trilhas.find(t => t.id == d.trilha);
        let cursoObj = cursos.find(c => c.id == d.curso);

        tabelaTrilhaCursos.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${trilhaObj ? trilhaObj.titulo : 'Trilha Excluída'}</td>
                <td>${cursoObj ? cursoObj.titulo : 'Curso Excluído'}</td>
                <td>${d.ordem}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${i})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(i) {
    if (confirm("Remover curso desta trilha?")) {
        dados.splice(i, 1);
        localStorage.setItem("trilhas_cursos", JSON.stringify(dados));
        render();
    }
}

carregar();
render();