class Curso {
    constructor(id, titulo, descricao, instrutor, categoria, nivel, data, aulas, horas) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.instrutor = instrutor;
        this.categoria = categoria;
        this.nivel = nivel;
        this.data = data;
        this.aulas = aulas;
        this.horas = horas;
    }
}

let cursos = JSON.parse(localStorage.getItem("cursos")) || [];
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];

function gerarId() {
    return cursos.length > 0 ? Math.max(...cursos.map(c => c.id)) + 1 : 1;
}

function carregarSelects() {
    let selectInstrutor = document.getElementById("instrutor");
    let selectCategoria = document.getElementById("categoria");
    let btnSubmit = document.querySelector("#formCurso button");

    if (usuarios.length === 0 || categorias.length === 0) {
        btnSubmit.disabled = true;
        selectInstrutor.innerHTML = `<option>Sem instrutores disponíveis</option>`;
        selectCategoria.innerHTML = `<option>Sem categorias disponíveis</option>`;
        return;
    }

    selectInstrutor.innerHTML = "";
    selectCategoria.innerHTML = "";

    usuarios.forEach(u => selectInstrutor.innerHTML += `<option value="${u.id}">${u.nome}</option>`);
    categorias.forEach(c => selectCategoria.innerHTML += `<option value="${c.id}">${c.nome}</option>`);
    
    // Preenche a data de hoje
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
}

document.getElementById("formCurso").addEventListener("submit", function (e) {
    e.preventDefault();

    let tituloVal = document.getElementById("titulo").value.trim();
    let descricaoVal = document.getElementById("descricao").value.trim();
    let instrutorVal = document.getElementById("instrutor").value;
    let categoriaVal = document.getElementById("categoria").value;
    let nivelVal = document.getElementById("nivel").value;
    let dataVal = document.getElementById("data").value;
    let aulasVal = parseInt(document.getElementById("aulas").value);
    let horasVal = parseFloat(document.getElementById("horas").value);

    if (aulasVal < 0 || isNaN(aulasVal)) {
        alert("O total de aulas deve ser positivo.");
        return;
    }
    if (horasVal < 0 || isNaN(horasVal)) {
        alert("O total de horas deve ser positivo.");
        return;
    }

    let curso = new Curso(gerarId(), tituloVal, descricaoVal, instrutorVal, categoriaVal, nivelVal, dataVal, aulasVal, horasVal);
    cursos.push(curso);
    localStorage.setItem("cursos", JSON.stringify(cursos));

    render();
    
    this.reset();
    // Restaura a data de hoje
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
});

function render() {
    let tabela = document.getElementById("tabelaCursos");
    tabela.innerHTML = "";

    cursos.forEach((c, index) => {
        let instrutorObj = usuarios.find(u => u.id == c.instrutor);
        let categoriaObj = categorias.find(cat => cat.id == c.categoria);
        let dataFormatada = new Date(c.data + 'T00:00:00').toLocaleDateString('pt-BR');

        tabela.innerHTML += `
            <tr>
                <td>${c.id}</td>
                <td>${c.titulo}</td>
                <td>${instrutorObj ? instrutorObj.nome : "Excluído"}</td>
                <td>${categoriaObj ? categoriaObj.nome : "Excluído"}</td>
                <td>${c.nivel}</td>
                <td>${dataFormatada}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(index) {
    if (confirm("Excluir este curso?")) {
        cursos.splice(index, 1);
        localStorage.setItem("cursos", JSON.stringify(cursos));
        render();
    }
}

carregarSelects();
render();