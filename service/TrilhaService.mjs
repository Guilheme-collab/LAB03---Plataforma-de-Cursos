import { Trilha } from '../model/Trilha.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'trilhas';

export class TrilhaService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(t => String(t.id) === String(id)) ?? null;
    }

    salvar(dados) {
        if (!dados.titulo?.trim()) throw new Error("Título é obrigatório.");
        if (!dados.categoria) throw new Error("Categoria é obrigatória.");
        if (!dados.curso) throw new Error("Curso é obrigatório.");

        const lista = this.listar();
        const trilha = new Trilha({ ...dados, id: nextId(lista) });
        lista.push(trilha);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return trilha;
    }

    atualizar(id, dados) {
        if (!dados.titulo?.trim()) throw new Error("Título é obrigatório.");

        const lista = this.listar();
        const idx = lista.findIndex(t => String(t.id) === String(id));
        if (idx === -1) throw new Error("Trilha não encontrada.");

        lista[idx] = { ...lista[idx], ...dados, id: lista[idx].id };
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(t => String(t.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
