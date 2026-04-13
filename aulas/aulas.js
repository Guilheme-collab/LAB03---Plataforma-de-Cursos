class Aula {
    constructor(id, modulo, titulo, tipo, url, duracao, ordem) {
        this.id = id;
        this.modulo = modulo;
        this.titulo = titulo;
        this.tipo = tipo;
        this.url = url;
        this.duracao = duracao;
        this.ordem = ordem;
    }
}

let aulas = JSON.parse(localStorage.getItem("aulas")) || [];
let modulos = JSON.parse(localStorage.getItem("modulos")) || [];

function gerarId() {
    return aulas.length > 0 ? Math.max(...aulas.map(a => a.id)) + 1 : 1;
}

function carregarModulos() {
    let selectModulo = document.getElementById("modulo");
    let btnSubmit = document.querySelector("#formAula button");

    if (modulos.length === 0) {
        btnSubmit.disabled = true;
        selectModulo.innerHTML = `<option>Sem módulos cadastrados</option>`;
        return;
    }

    selectModulo.innerHTML = "";
    modulos.forEach(m => {
        selectModulo.innerHTML += `<option value="${m.id}">${m.titulo}</option>`;
    });
}

document.getElementById("formAula").addEventListener("submit", function (e) {
    e.preventDefault();

    let moduloVal = document.getElementById("modulo").value;
    let tituloVal = document.getElementById("titulo").value.trim();
    let tipoVal = document.getElementById("tipo").value;
    let urlVal = document.getElementById("url").value.trim();
    let duracaoVal = parseInt(document.getElementById("duracao").value);
    let ordemVal = parseInt(document.getElementById("ordem").value);

    if (duracaoVal <= 0 || isNaN(duracaoVal)) {
        alert("A duração deve ser maior que zero minutos.");
        return;
    }

    if (ordemVal <= 0 || isNaN(ordemVal)) {
        alert("A ordem deve ser um número positivo.");
        return;
    }

    let aula = new Aula(gerarId(), moduloVal, tituloVal, tipoVal, urlVal, duracaoVal, ordemVal);
    aulas.push(aula);
    localStorage.setItem("aulas", JSON.stringify(aulas));

    render();
    this.reset();
});

function render() {
    let tabela = document.getElementById("tabelaAulas");
    tabela.innerHTML = "";

    aulas.forEach((a, index) => {
        let moduloObj = modulos.find(m => m.id == a.modulo);

        tabela.innerHTML += `
            <tr>
                <td>${a.id}</td>
                <td>${moduloObj ? moduloObj.titulo : 'Módulo Excluído'}</td>
                <td>${a.titulo}</td>
                <td>${a.tipo}</td>
                <td>${a.duracao} min</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${index})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(index) {
    if (confirm("Deseja excluir esta aula?")) {
        aulas.splice(index, 1);
        localStorage.setItem("aulas", JSON.stringify(aulas));
        render();
    }
}

carregarModulos();
render();