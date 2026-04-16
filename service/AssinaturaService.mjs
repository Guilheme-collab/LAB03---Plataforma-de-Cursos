import { Assinatura } from '../model/Assinatura.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'assinaturas';

export class AssinaturaService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(a => String(a.id) === String(id)) ?? null;
    }

    salvar(dados) {
        if (!dados.usuario) throw new Error("Selecione um usuário.");
        if (!dados.plano) throw new Error("Selecione um plano.");
        if (!dados.inicio) throw new Error("Data de início é obrigatória.");
        if (!dados.fim) throw new Error("Data de fim é obrigatória.");

        const lista = this.listar();
        const ass = new Assinatura({ ...dados, id: nextId(lista) });
        lista.push(ass);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return ass;
    }

    atualizar(id, dados) {
        const lista = this.listar();
        const idx = lista.findIndex(a => String(a.id) === String(id));
        if (idx === -1) throw new Error("Assinatura não encontrada.");

        lista[idx] = { ...lista[idx], ...dados, id: lista[idx].id };
        localStorage.setItem(KEY, JSON.stringify(lista));
    }

    excluir(id) {
        const lista = this.listar().filter(a => String(a.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
