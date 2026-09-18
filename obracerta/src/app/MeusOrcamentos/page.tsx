"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import MenuLateral from "../components/MenuLateral";

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
  const [carregandoAuth, setCarregandoAuth] = useState(true);
  const [userEmail, setUserEmail] = useState("Profissional");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [busca, setBusca] = useState<string>("");
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
      } else {
        if (session.user?.email) {
          setUserEmail(session.user.email.split("@")[0]);
        }
        setCarregandoAuth(false);
        const dadosSalvos = localStorage.getItem("obracerta_orcamentos");
        if (dadosSalvos) {
          setOrcamentos(JSON.parse(dadosSalvos));
        }
      }
    };
    checkAuth();
  }, [router]);

  const orcamentosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    return orcamentos.filter((o) => {
      const atendeStatus =
        filtroStatus === "todos" || o.status === filtroStatus;
      const atendeBusca =
        !termo ||
        o.clienteNome.toLowerCase().includes(termo) ||
        o.clienteTelefone.includes(termo) ||
        o.dataCriacao.includes(termo);

      return atendeStatus && atendeBusca;
    });
  }, [orcamentos, filtroStatus, busca]);

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

  if (carregandoAuth) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      <MenuLateral />

      {/* Header Estilo Minimalista Idêntico ao Dashboard */}
      <header className="bg-white border-bottom border-light px-3 py-3 sticky-top">
        <div
          className="container p-0 d-flex align-items-center justify-content-between"
          style={{ maxWidth: "500px" }}
        >
          <button
            className="btn btn-light btn-sm rounded-circle p-2 border-0 d-flex align-items-center justify-content-center"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#menuLateral"
            style={{ width: "38px", height: "38px" }}
          >
            <i className="bi bi-list fs-5 text-dark"></i>
          </button>

          <span
            className="fw-black fs-5 tracking-tight"
            style={{ color: "var(--color-teal-dark)" }}
          >
            ObraCerta
          </span>

          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white small"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "var(--color-teal-dark)",
            }}
          >
            {userEmail.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="container py-4 px-3" style={{ maxWidth: "500px" }}>
        {/* Título de Boas-Vindas e Ação Principal */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h1 className="h4 fw-black text-dark mb-0">Meus Orçamentos</h1>
            <small className="text-muted" style={{ fontSize: "0.8rem" }}>
              Gerencie suas propostas e assinaturas
            </small>
          </div>
          <button
            onClick={() => router.push("/orcamento/novo")}
            className="btn btn-sm rounded-pill fw-bold px-3 shadow-sm text-white"
            style={{
              backgroundColor: "var(--color-teal-accent)",
              borderColor: "var(--color-teal-accent)",
            }}
          >
            <i className="bi bi-plus-lg me-1"></i> Criar
          </button>
        </div>

        {/* Input de Busca */}
        <div className="input-group mb-3 shadow-2xs rounded-3 bg-white border border-light-subtle overflow-hidden">
          <span className="input-group-text bg-white border-0 text-muted ps-3">
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
              className="btn btn-white bg-white border-0 text-muted pe-3"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        {/* Filtros em Pílulas */}
        <div className="d-flex gap-2 mb-3 overflow-x-auto pb-1">
          {["todos", "pendente", "aprovado"].map((st) => (
            <button
              key={st}
              onClick={() => setFiltroStatus(st)}
              className={`btn btn-sm rounded-pill px-3 fw-semibold text-capitalize transition-all ${
                filtroStatus === st
                  ? "btn-dark shadow-sm"
                  : "btn-outline-secondary bg-white text-muted border-light-subtle"
              }`}
            >
              {st === "todos"
                ? `Todos (${orcamentos.length})`
                : st === "pendente"
                ? "Aguardando"
                : "Assinados"}
            </button>
          ))}
        </div>

        {/* Lista / Estado Vazio */}
        {orcamentosFiltrados.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center my-4 bg-white">
            <div className="mb-3">
              <i
                className="bi bi-file-earmark-plus display-3"
                style={{ color: "var(--color-teal-accent)" }}
              ></i>
            </div>
            <h2 className="h6 fw-bold text-dark">
              Você ainda não possui orçamentos
            </h2>
            <p className="text-muted small mb-3">
              {busca
                ? "Nenhum resultado encontrado para a sua busca."
                : "Crie o seu primeiro orçamento para enviar pelo WhatsApp e organizar seus clientes."}
            </p>
            {!busca && (
              <button
                onClick={() => router.push("/orcamento/novo")}
                className="btn text-white fw-bold rounded-pill px-4 shadow-sm"
                style={{
                  backgroundColor: "var(--color-teal-accent)",
                  borderColor: "var(--color-teal-accent)",
                }}
              >
                <i className="bi bi-plus-lg me-1"></i> Criar Primeiro Orçamento
              </button>
            )}
          </div>
        ) : (
          <div className="d-flex flex-column gap-2">
            {orcamentosFiltrados.map((item) => (
              <div
                key={item.id}
                className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white"
              >
                <div className="card-body p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h2 className="h6 fw-bold mb-0 text-dark">
                        {item.clienteNome}
                      </h2>
                      <small
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        <i className="bi bi-calendar3 me-1"></i>
                        {item.dataCriacao} •{" "}
                        <i className="bi bi-whatsapp me-1"></i>
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
                        R${" "}
                        {item.valorTotal.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/orcamento/editar/${item.id}`)
                        }
                        className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px" }}
                        title="Editar Orçamento"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

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