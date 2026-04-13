class Progresso {
    constructor(usuario, aula, status, data) {
        this.usuario = usuario;
        this.aula = aula;
        this.status = status;
        this.data = data;
    }
}

let progresso = JSON.parse(localStorage.getItem("progresso")) || [];
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
let aulas = JSON.parse(localStorage.getItem("aulas")) || [];

function carregar() {
    let selectUsuario = document.getElementById("usuario");
    let selectAula = document.getElementById("aula");
    let btnSubmit = document.querySelector("#formProgresso button");

    if (usuarios.length === 0 || aulas.length === 0) {
        btnSubmit.disabled = true;
        selectUsuario.innerHTML = `<option>Sem usuários</option>`;
        selectAula.innerHTML = `<option>Sem aulas</option>`;
        return;
    }
    
    selectUsuario.innerHTML = "";
    selectAula.innerHTML = "";

    usuarios.forEach(u => selectUsuario.innerHTML += `<option value="${u.id}">${u.nome}</option>`);
    aulas.forEach(a => selectAula.innerHTML += `<option value="${a.id}">${a.titulo}</option>`);
    
    // Preenche a data de hoje
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
}

document.getElementById("formProgresso").addEventListener("submit", function(e) {
    e.preventDefault();

    let usuarioVal = document.getElementById("usuario").value;
    let aulaVal = document.getElementById("aula").value;
    let statusVal = document.getElementById("status").value;
    let dataVal = document.getElementById("data").value;

    let registroExistente = progresso.findIndex(p => p.usuario == usuarioVal && p.aula == aulaVal);
    
    if (registroExistente !== -1) {
        progresso[registroExistente].status = statusVal;
        progresso[registroExistente].data = dataVal;
        alert("Status atualizado com sucesso!");
    } else {
        let obj = new Progresso(usuarioVal, aulaVal, statusVal, dataVal);
        progresso.push(obj);
    }

    localStorage.setItem("progresso", JSON.stringify(progresso));
    render();
    
    this.reset();
    // Restaura a data de hoje
    document.getElementById("data").value = new Date().toISOString().split('T')[0];
});

function render() {
    let tabelaProgresso = document.getElementById("tabelaProgresso");
    tabelaProgresso.innerHTML = "";

    progresso.forEach((p, i) => {
        let user = usuarios.find(u => u.id == p.usuario);
        let aulaObj = aulas.find(a => a.id == p.aula);
        let dataFormatada = new Date(p.data + 'T00:00:00').toLocaleDateString('pt-BR');
        let badgeClass = p.status === 'Concluído' ? 'bg-success' : 'bg-warning text-dark';

        tabelaProgresso.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${user ? user.nome : 'Excluído'}</td>
                <td>${aulaObj ? aulaObj.titulo : 'Excluída'}</td>
                <td><span class="badge ${badgeClass}">${p.status}</span></td>
                <td>${dataFormatada}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="remover(${i})">Excluir</button>
                </td>
            </tr>
        `;
    });
}

function remover(i) {
    if (confirm("Excluir este registro?")) {
        progresso.splice(i, 1);
        localStorage.setItem("progresso", JSON.stringify(progresso));
        render();
    }
}

carregar();
render();