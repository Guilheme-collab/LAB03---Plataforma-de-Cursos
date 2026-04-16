import { Aula } from '../model/Aula.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'aulas';

export class AulaService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(a => String(a.id) === String(id)) ?? null;
    }

    salvar(dados) {
        if (!dados.titulo?.trim()) throw new Error("Título é obrigatório.");
        if (isNaN(parseInt(dados.duracao)) || parseInt(dados.duracao) <= 0) throw new Error("Duração deve ser maior que zero minutos.");
        if (isNaN(parseInt(dados.ordem)) || parseInt(dados.ordem) <= 0) throw new Error("Ordem deve ser um número positivo.");

        const lista = this.listar();
        const aula = new Aula({ ...dados, id: nextId(lista) });
        lista.push(aula);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return aula;
    }

    atualizar(id, dados) {
        if (!dados.titulo?.trim()) throw new Error("Título é obrigatório.");

        const lista = this.listar();
        const idx = lista.findIndex(a => String(a.id) === String(id));
        if (idx === -1) throw new Error("Aula não encontrada.");

        lista[idx] = { ...lista[idx], ...dados, id: lista[idx].id };
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(a => String(a.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
