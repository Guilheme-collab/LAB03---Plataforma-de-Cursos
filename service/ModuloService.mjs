import { Modulo } from '../model/Modulo.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'modulos';

export class ModuloService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(m => String(m.id) === String(id)) ?? null;
    }

    salvar(dados) {
        if (!dados.curso) throw new Error("Curso é obrigatório.");
        if (!dados.titulo?.trim()) throw new Error("Título é obrigatório.");
        if (isNaN(parseInt(dados.ordem)) || parseInt(dados.ordem) <= 0)
            throw new Error("A ordem deve ser um número maior que zero.");

        const lista = this.listar();
        const modulo = new Modulo({ ...dados, id: nextId(lista) });
        lista.push(modulo);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return modulo;
    }

    atualizar(id, dados) {
        if (!dados.titulo?.trim()) throw new Error("Título é obrigatório.");

        const lista = this.listar();
        const idx = lista.findIndex(m => String(m.id) === String(id));
        if (idx === -1) throw new Error("Módulo não encontrado.");

        lista[idx] = { ...lista[idx], ...dados, id: lista[idx].id };
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(m => String(m.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
