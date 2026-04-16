import { TrilhaCurso } from '../model/TrilhaCurso.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'trilhas_cursos';

export class TrilhaCursoService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    salvar(dados) {
        if (!dados.trilha) throw new Error("Trilha é obrigatória.");
        if (!dados.curso) throw new Error("Curso é obrigatório.");
        if (isNaN(parseInt(dados.ordem)) || parseInt(dados.ordem) <= 0)
            throw new Error("A ordem deve ser um número maior que zero.");

        const lista = this.listar();
        const tc = new TrilhaCurso({ ...dados, id: nextId(lista) });
        lista.push(tc);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return tc;
    }

    excluir(id) {
        const lista = this.listar().filter((tc, idx) =>
            String(tc.id) !== String(id) && String(idx) !== String(id)
        );
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
