import { Curso } from '../model/Curso.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'cursos';

export class CursoService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(c => String(c.id) === String(id)) ?? null;
    }

    salvar(dados) {
        if (!dados.titulo?.trim()) throw new Error("Título é obrigatório.");
        if (isNaN(parseInt(dados.aulas)) || parseInt(dados.aulas) < 0) throw new Error("Total de aulas deve ser positivo.");
        if (isNaN(parseFloat(dados.horas)) || parseFloat(dados.horas) < 0) throw new Error("Total de horas deve ser positivo.");

        const lista = this.listar();
        const curso = new Curso({ ...dados, id: nextId(lista) });
        lista.push(curso);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return curso;
    }

    atualizar(id, dados) {
        if (!dados.titulo?.trim()) throw new Error("Título é obrigatório.");

        const lista = this.listar();
        const idx = lista.findIndex(c => String(c.id) === String(id));
        if (idx === -1) throw new Error("Curso não encontrado.");

        lista[idx] = { ...lista[idx], ...dados, id: lista[idx].id };
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(c => String(c.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
