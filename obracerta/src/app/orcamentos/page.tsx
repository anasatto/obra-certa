"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Orcamento {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  dataCriacao: string;
  valorTotal: number;
  status: "pendente" | "aprovado" | "expirado";
}

export default function ListaOrcamentosPage() {
  const router = useRouter();
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [busca, setBusca] = useState<string>("");
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);

  useEffect(() => {
    const dadosSalvos = localStorage.getItem("obracerta_orcamentos");
    if (dadosSalvos) {
      setOrcamentos(JSON.parse(dadosSalvos));
    }
  }, []);

  const orcamentosFiltrados = orcamentos.filter((o) => {
    const atendeStatus = filtroStatus === "todos" || o.status === filtroStatus;
    const termo = busca.toLowerCase().trim();
    const atendeBusca =
      o.clienteNome.toLowerCase().includes(termo) ||
      o.clienteTelefone.includes(termo) ||
      o.dataCriacao.includes(termo);

    return atendeStatus && atendeBusca;
  });

  const getBadgeStatus = (status: string) => {
    switch (status) {
      case "aprovado":
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill">
            <i className="bi bi-check-circle-fill me-1"></i> Assinado
          </span>
        );
      case "pendente":
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-pill">
            <i className="bi bi-clock-history me-1"></i> Aguardando
          </span>
        );
      case "expirado":
        return (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill">
            <i className="bi bi-x-circle me-1"></i> Expirado
          </span>
        );
      default:
        return null;
    }
  };

  const reenviarWhatsApp = (orcamento: Orcamento) => {
    const linkPublico = `${window.location.origin}/o/${orcamento.id}`;
    const mensagem = encodeURIComponent(
      `Olá *${orcamento.clienteNome}*! Passando para relembrar do seu orçamento.\n\n` +
        `Você pode conferir os detalhes e assinar no link: ${linkPublico}`
    );
    window.open(
      `https://api.whatsapp.com/send?phone=55${orcamento.clienteTelefone}&text=${mensagem}`,
      "_blank"
    );
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <header className="bg-dark text-white sticky-top shadow-sm border-bottom border-warning border-3 px-3 py-3">
        <div
          className="container p-0 d-flex align-items-center justify-content-between"
          style={{ maxWidth: "500px" }}
        >
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-light btn-sm border-0 fs-5 p-1"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#menuLateral"
            >
              <i className="bi bi-list"></i>
            </button>
            <div>
              <h1 className="h6 mb-0 fw-bold text-uppercase">ObraCerta</h1>
              <small className="text-warning" style={{ fontSize: "0.75rem" }}>
                Meus Orçamentos
              </small>
            </div>
          </div>

          <button
            onClick={() => router.push("/orcamento/novo")}
            className="btn btn-warning text-dark btn-sm rounded-pill fw-bold px-3 shadow-sm"
          >
            <i className="bi bi-plus-lg me-1"></i> Novo
          </button>
        </div>
      </header>

      {/* Menu Lateral */}
      <div
        className="offcanvas offcanvas-start bg-dark text-white"
        tabIndex={-1}
        id="menuLateral"
        style={{ maxWidth: "280px" }}
      >
        <div className="offcanvas-header border-bottom border-secondary">
          <h5 className="offcanvas-title h6 fw-bold mb-0">ObraCerta App</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body p-0 py-3">
          <div className="list-group list-group-flush">
            <button
              onClick={() => router.push("/orcamento/novo")}
              data-bs-dismiss="offcanvas"
              className="list-group-item list-group-item-action bg-transparent text-white border-0 px-3 py-3 d-flex align-items-center gap-3"
            >
              <i className="bi bi-plus-circle text-warning fs-5"></i>
              <span>Novo Orçamento</span>
            </button>
            <button
              onClick={() => router.push("/orcamentos")}
              data-bs-dismiss="offcanvas"
              className="list-group-item list-group-item-action bg-transparent text-white border-0 px-3 py-3 d-flex align-items-center gap-3 fw-bold active"
            >
              <i className="bi bi-file-earmark-text text-warning fs-5"></i>
              <span>Meus Orçamentos</span>
            </button>
          </div>
        </div>
      </div>

      <main className="container py-3 px-3" style={{ maxWidth: "500px" }}>
        <div className="input-group mb-3 shadow-sm rounded-3">
          <span className="input-group-text bg-white border-0 text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control border-0 bg-white py-2"
            placeholder="Buscar por nome, celular ou data..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          {busca && (
            <button
              onClick={() => setBusca("")}
              className="btn btn-white bg-white border-0 text-muted"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        <div className="d-flex gap-2 mb-3 overflow-x-auto pb-1">
          <button
            onClick={() => setFiltroStatus("todos")}
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              filtroStatus === "todos" ? "btn-dark" : "btn-outline-secondary bg-white"
            }`}
          >
            Todos ({orcamentos.length})
          </button>
          <button
            onClick={() => setFiltroStatus("pendente")}
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              filtroStatus === "pendente"
                ? "btn-warning text-dark"
                : "btn-outline-secondary bg-white"
            }`}
          >
            Aguardando
          </button>
          <button
            onClick={() => setFiltroStatus("aprovado")}
            className={`btn btn-sm rounded-pill px-3 fw-semibold ${
              filtroStatus === "aprovado" ? "btn-success" : "btn-outline-secondary bg-white"
            }`}
          >
            Assinados
          </button>
        </div>

        {orcamentosFiltrados.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center my-4 bg-white">
            <div className="mb-3">
              <i className="bi bi-file-earmark-plus text-warning display-3"></i>
            </div>
            <h2 className="h6 fw-bold text-dark">Você ainda não possui orçamentos</h2>
            <p className="text-muted small mb-3">
              {busca
                ? "Nenhum resultado encontrado para a sua busca."
                : "Crie o seu primeiro orçamento para enviar pelo WhatsApp e organizar seus clientes."}
            </p>
            {!busca && (
              <button
                onClick={() => router.push("/orcamento/novo")}
                className="btn btn-warning text-dark fw-bold rounded-pill px-4 shadow-sm"
              >
                <i className="bi bi-plus-lg me-1"></i> Criar Primeiro Orçamento
              </button>
            )}
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {orcamentosFiltrados.map((item) => (
              <div key={item.id} className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h2 className="h6 fw-bold mb-0 text-dark">{item.clienteNome}</h2>
                      <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                        <i className="bi bi-calendar3 me-1"></i>
                        {item.dataCriacao} • <i className="bi bi-whatsapp me-1"></i>
                        {item.clienteTelefone}
                      </small>
                    </div>
                    {getBadgeStatus(item.status)}
                  </div>

                  <div className="d-flex justify-content-between align-items-end mt-3 pt-2 border-top border-light-subtle">
                    <div>
                      <small
                        className="text-muted d-block font-monospace"
                        style={{ fontSize: "0.65rem" }}
                      >
                        VALOR
                      </small>
                      <span className="fw-black text-dark fs-5">
                        R$ {item.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="d-flex gap-2">
                      {/* Botão para Editar Orçamento */}
                      <button
                        onClick={() => router.push(`/orcamento/editar/${item.id}`)}
                        className="btn btn-outline-warning text-dark btn-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px" }}
                        title="Editar Orçamento"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      {/* Botão para Reenviar no WhatsApp */}
                      <button
                        onClick={() => reenviarWhatsApp(item)}
                        className="btn btn-outline-success btn-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px" }}
                        title="Reenviar no WhatsApp"
                      >
                        <i className="bi bi-whatsapp"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}