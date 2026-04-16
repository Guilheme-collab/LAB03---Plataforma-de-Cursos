import * as AssinaturaCtrl from './controller/AssinaturaController.mjs';
import * as AulaCtrl from './controller/AulaController.mjs';
import * as AvaliacaoCtrl from './controller/AvaliacaoController.mjs';
import * as CategoriaCtrl from './controller/CategoriaController.mjs';
import * as CertificadoCtrl from './controller/CertificadoController.mjs';
import * as CursoCtrl from './controller/CursoController.mjs';
import * as MatriculaCtrl from './controller/MatriculaController.mjs';
import * as ModuloCtrl from './controller/ModuloController.mjs';
import * as PagamentoCtrl from './controller/PagamentoController.mjs';
import * as PlanoCtrl from './controller/PlanoController.mjs';
import * as ProgressoCtrl from './controller/ProgressoController.mjs';
import * as TrilhaCtrl from './controller/TrilhaController.mjs';
import * as TrilhaCursoCtrl from './controller/TrilhaCursoController.mjs';
import * as UsuarioCtrl from './controller/UsuarioController.mjs';

Object.assign(window, {
    ...AssinaturaCtrl,
    ...AulaCtrl,
    ...AvaliacaoCtrl,
    ...CategoriaCtrl,
    ...CertificadoCtrl,
    ...CursoCtrl,
    ...MatriculaCtrl,
    ...ModuloCtrl,
    ...PagamentoCtrl,
    ...PlanoCtrl,
    ...ProgressoCtrl,
    ...TrilhaCtrl,
    ...TrilhaCursoCtrl,
    ...UsuarioCtrl,
    toggleVisibilidadeSenha: () => {
        const input = document.getElementById('senha');
        const btn = document.getElementById('toggleSenha');
        if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = 'Ocultar';
        } else {
            input.type = 'password';
            btn.textContent = 'Ver';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tabelaUsuarios')) { UsuarioCtrl.renderTabela(); }
    if (document.getElementById('tabelaCategorias')) { CategoriaCtrl.renderTabela(); }
    if (document.getElementById('tabelaCursos')) { CursoCtrl.initEventos(); CursoCtrl.renderTabela(); }
    if (document.getElementById('tabelaModulos')) { ModuloCtrl.initEventos(); ModuloCtrl.renderTabela(); }
    if (document.getElementById('tabelaAulas')) { AulaCtrl.initEventos(); AulaCtrl.renderTabela(); }
    if (document.getElementById('tabelaMatriculas')) { MatriculaCtrl.initEventos(); MatriculaCtrl.renderTabela(); }
    if (document.getElementById('tabelaProgresso')) { ProgressoCtrl.initEventos(); ProgressoCtrl.renderTabela(); }
    if (document.getElementById('tabelaAvaliacoes')) { AvaliacaoCtrl.initEventos(); AvaliacaoCtrl.renderTabela(); }
    if (document.getElementById('tabelaTrilhas')) { TrilhaCtrl.initEventos(); TrilhaCtrl.renderTabela(); }
    if (document.getElementById('tabelaTrilhaCursos')) { TrilhaCursoCtrl.initEventos(); TrilhaCursoCtrl.renderTabela(); }
    if (document.getElementById('tabelaCertificados')) { CertificadoCtrl.initEventos(); CertificadoCtrl.renderTabela(); }
    if (document.getElementById('tabelaPlanos')) { PlanoCtrl.renderTabela(); }
    if (document.getElementById('tabelaAssinaturas')) { AssinaturaCtrl.initEventos(); AssinaturaCtrl.renderTabela(); }
    if (document.getElementById('tabelaPagamentos')) { PagamentoCtrl.initEventos(); PagamentoCtrl.renderTabela(); }
});
