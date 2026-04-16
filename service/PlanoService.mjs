import { Plano } from '../model/Plano.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'planos';

export class PlanoService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(p => String(p.id) === String(id)) ?? null;
    }

    salvar(dados) {
        if (!dados.nome?.trim()) throw new Error("Nome do plano é obrigatório.");
        if (isNaN(parseFloat(dados.preco)) || parseFloat(dados.preco) < 0)
            throw new Error("Preço não pode ser negativo.");
        if (isNaN(parseInt(dados.duracao)) || parseInt(dados.duracao) <= 0)
            throw new Error("Duração deve ser maior que zero meses.");

        const lista = this.listar();
        if (lista.some(p => p.nome.toLowerCase() === dados.nome.trim().toLowerCase()))
            throw new Error("Já existe um plano com este nome.");

        const plano = new Plano({ ...dados, id: nextId(lista) });
        lista.push(plano);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return plano;
    }

    atualizar(id, dados) {
        if (!dados.nome?.trim()) throw new Error("Nome do plano é obrigatório.");
        if (isNaN(parseFloat(dados.preco)) || parseFloat(dados.preco) < 0)
            throw new Error("Preço não pode ser negativo.");
        if (isNaN(parseInt(dados.duracao)) || parseInt(dados.duracao) <= 0)
            throw new Error("Duração deve ser maior que zero meses.");

        const lista = this.listar();
        const idx = lista.findIndex(p => String(p.id) === String(id));
        if (idx === -1) throw new Error("Plano não encontrado.");

        if (lista.some(p => p.nome.toLowerCase() === dados.nome.trim().toLowerCase() && String(p.id) !== String(id)))
            throw new Error("Já existe um plano com este nome.");

        lista[idx] = { ...lista[idx], ...dados, id: lista[idx].id };
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(p => String(p.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
