export class Certificado {
    constructor({ id, usuario, curso, trilha, codigo, data }) {
        this.id = id;
        this.usuario = usuario;
        this.curso = curso;
        this.trilha = trilha || null;
        this.codigo = codigo;
        this.data = data;
    }
}
