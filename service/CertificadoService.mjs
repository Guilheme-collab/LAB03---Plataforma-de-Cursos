import { Certificado } from '../model/Certificado.mjs';
import { nextId } from '../utils/id.mjs';

const KEY = 'certificados';

export class CertificadoService {
    listar() {
        return JSON.parse(localStorage.getItem(KEY) || '[]');
    }

    buscarPorId(id) {
        return this.listar().find(c => String(c.id) === String(id)) ?? null;
    }

    salvar(dados) {
        if (!dados.usuario) throw new Error("Usuário é obrigatório.");
        if (!dados.curso) throw new Error("Curso é obrigatório.");

        const lista = this.listar();
        const cert = new Certificado({ ...dados, id: nextId(lista) });
        lista.push(cert);
        localStorage.setItem(KEY, JSON.stringify(lista));
        return cert;
    }

    excluir(id) {
        const lista = this.listar().filter(c => String(c.id) !== String(id));
        localStorage.setItem(KEY, JSON.stringify(lista));
    }
}
