import { Avaliacao } from '../model/Avaliacao.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'avaliacoes';

export class AvaliacaoService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(a => String(a.id) === String(id)) ?? null;
    }

    salvar(dados) {
        const erros = Avaliacao.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));

        const lista = this.listar();
        if (lista.some(a => String(a.usuario) === String(dados.usuario) && String(a.curso) === String(dados.curso)))
            throw new Error("Este usuário já avaliou este curso.");

        const ava = new Avaliacao({ ...dados, id: nextId(lista) });
        lista.push(ava);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return ava;
    }

    excluir(id) {
        const lista = this.listar().filter(a => String(a.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
