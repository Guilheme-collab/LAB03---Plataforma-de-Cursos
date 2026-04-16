import { Categoria } from '../model/Categoria.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'categorias';

export class CategoriaService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(c => String(c.id) === String(id)) ?? null;
    }

    salvar(dados) {
        const nomeVal = dados.nome?.trim();
        if (!nomeVal) throw new Error("Nome da categoria é obrigatório.");

        const lista = this.listar();
        if (lista.some(c => c.nome.toLowerCase() === nomeVal.toLowerCase()))
            throw new Error("Já existe uma categoria com este nome!");

        const categoria = new Categoria({ ...dados, id: nextId(lista) });
        lista.push(categoria);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return categoria;
    }

    atualizar(id, dados) {
        const nomeVal = dados.nome?.trim();
        if (!nomeVal) throw new Error("Nome da categoria é obrigatório.");

        const lista = this.listar();
        const idx = lista.findIndex(c => String(c.id) === String(id));
        if (idx === -1) throw new Error("Categoria não encontrada.");

        if (lista.some(c => c.nome.toLowerCase() === nomeVal.toLowerCase() && String(c.id) !== String(id)))
            throw new Error("Já existe uma categoria com este nome!");

        lista[idx] = { ...lista[idx], ...dados, id: lista[idx].id };
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(c => String(c.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
