import { Matricula } from '../model/Matricula.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'matriculas';

export class MatriculaService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(m => String(m.id) === String(id)) ?? null;
    }

    salvar(dados) {
        if (!dados.usuario) throw new Error("Usuário é obrigatório.");
        if (!dados.curso) throw new Error("Curso é obrigatório.");

        const lista = this.listar();
        if (lista.some(m => String(m.usuario) === String(dados.usuario) && String(m.curso) === String(dados.curso)))
            throw new Error("Este usuário já está matriculado neste curso!");

        const matri = new Matricula({ ...dados, id: nextId(lista) });
        lista.push(matri);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return matri;
    }

    atualizar(id, dados) {
        const lista = this.listar();
        const idx = lista.findIndex(m => String(m.id) === String(id));
        if (idx === -1) throw new Error("Matrícula não encontrada.");

        lista[idx] = { ...lista[idx], ...dados, id: lista[idx].id };
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(m => String(m.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
