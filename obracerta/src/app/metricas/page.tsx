"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import MenuLateral from "../components/MenuLateral";

interface Orcamento {
  id: string;
  valorTotal: number;
  status: "pendente" | "aprovado" | "expirado";
  dataCriacao: string;
}

export default function MetricasPage() {
  const router = useRouter();
  const [carregandoAuth, setCarregandoAuth] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<"resumo" | "desempenho" | "conversao">("resumo");
  const [userEmail, setUserEmail] = useState("Profissional");

  // Métricas
  const [faturamentoTotal, setFaturamentoTotal] = useState(0);
  const [faturamentoPendente, setFaturamentoPendente] = useState(0);
  const [totalAprovados, setTotalAprovados] = useState(0);
  const [totalPendentes, setTotalPendentes] = useState(0);
  const [totalExpirados, setTotalExpirados] = useState(0);
  const [totalOrcamentos, setTotalOrcamentos] = useState(0);

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
        carregarMetricas();
      }
    };
    checkAuth();
  }, [router]);

  const carregarMetricas = () => {
    const dadosSalvos = localStorage.getItem("obracerta_orcamentos");
    if (dadosSalvos) {
      const orcamentos: Orcamento[] = JSON.parse(dadosSalvos);

      let aprovados = 0;
      let pendentes = 0;
      let qtdAprovados = 0;
      let qtdPendentes = 0;
      let qtdExpirados = 0;

      orcamentos.forEach((o) => {
        if (o.status === "aprovado") {
          aprovados += o.valorTotal;
          qtdAprovados++;
        } else if (o.status === "pendente") {
          pendentes += o.valorTotal;
          qtdPendentes++;
        } else if (o.status === "expirado") {
          qtdExpirados++;
        }
      });

      setFaturamentoTotal(aprovados);
      setFaturamentoPendente(pendentes);
      setTotalAprovados(qtdAprovados);
      setTotalPendentes(qtdPendentes);
      setTotalExpirados(qtdExpirados);
      setTotalOrcamentos(orcamentos.length);
    }
  };

  if (carregandoAuth) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="spinner-border text-success" role="status"></div>
      </div>
    );
  }

  const taxaConversao =
    totalOrcamentos === 0
      ? 0
      : Math.round((totalAprovados / totalOrcamentos) * 100);

  const ticketMedio =
    totalAprovados === 0 ? 0 : faturamentoTotal / totalAprovados;

  return (
    <div className="bg-light min-vh-100 pb-5">
      <MenuLateral />

      {/* Header Estilo Minimalista e Limpo */}
      <header className="bg-white border-bottom border-light px-3 py-3 sticky-top">
        <div
          className="container p-0 d-flex align-items-center justify-content-between"
          style={{ maxWidth: "500px" }}
        >
          {/* Botão Hambúrguer Arredondado no Hover */}
          <button
            className="btn btn-light rounded-circle p-0 d-flex align-items-center justify-content-center border-0 transition-all"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#menuLateral"
            style={{
              width: "38px",
              height: "38px",
              backgroundColor: "#f4f6f6",
            }}
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
        {/* Saudação do Usuário */}
        <div className="mb-3">
          <h1 className="h3 fw-black text-dark mb-1">
            Olá, <span className="text-capitalize">{userEmail}</span>
          </h1>
          <div
            className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-white border border-light-subtle shadow-2xs"
            style={{ fontSize: "0.8rem" }}
          >
            <i className="bi bi-check-circle-fill text-success"></i>
            <span className="text-secondary fw-medium">
              Conta ativa • Painel de Gestão
            </span>
          </div>
        </div>

        {/* Abas de Navegação Superior */}
        <div className="d-flex border-bottom border-light-subtle mb-4 overflow-x-auto gap-4 pt-2">
          <button
            onClick={() => setAbaAtiva("resumo")}
            className={`btn btn-link text-decoration-none px-0 pb-2 rounded-0 border-0 fw-bold small transition-all ${
              abaAtiva === "resumo"
                ? "text-dark border-bottom border-2"
                : "text-muted opacity-75"
            }`}
            style={{
              borderColor:
                abaAtiva === "resumo"
                  ? "var(--color-teal-accent)"
                  : "transparent",
            }}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setAbaAtiva("desempenho")}
            className={`btn btn-link text-decoration-none px-0 pb-2 rounded-0 border-0 fw-bold small transition-all ${
              abaAtiva === "desempenho"
                ? "text-dark border-bottom border-2"
                : "text-muted opacity-75"
            }`}
            style={{
              borderColor:
                abaAtiva === "desempenho"
                  ? "var(--color-teal-accent)"
                  : "transparent",
            }}
          >
            Em Negociação
          </button>
          <button
            onClick={() => setAbaAtiva("conversao")}
            className={`btn btn-link text-decoration-none px-0 pb-2 rounded-0 border-0 fw-bold small transition-all ${
              abaAtiva === "conversao"
                ? "text-dark border-bottom border-2"
                : "text-muted opacity-75"
            }`}
            style={{
              borderColor:
                abaAtiva === "conversao"
                  ? "var(--color-teal-accent)"
                  : "transparent",
            }}
          >
            Taxa de Fechamento
          </button>
        </div>

        {/* Cartão Dinâmico Baseado na Aba Selecionada */}
        <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small
              className="text-uppercase font-monospace fw-bold text-muted"
              style={{ fontSize: "0.7rem", letterSpacing: "1px" }}
            >
              {abaAtiva === "resumo" && "VALOR EM CONTRATOS APROVADOS"}
              {abaAtiva === "desempenho" && "TOTAL EM NEGOCIAÇÃO PENDENTE"}
              {abaAtiva === "conversao" && "TAXA DE ACEITAÇÃO DE PROPOSTAS"}
            </small>
            <i className="bi bi-info-circle text-muted"></i>
          </div>

          <div className="my-2">
            <h2 className="display-6 fw-black text-dark mb-0">
              {abaAtiva === "resumo" &&
                `R$ ${faturamentoTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              {abaAtiva === "desempenho" &&
                `R$ ${faturamentoPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
              {abaAtiva === "conversao" && `${taxaConversao}%`}
            </h2>
          </div>

          {/* Gráfico de Tendência SVG */}
          <div className="py-3">
            <svg
              viewBox="0 0 300 40"
              className="w-100"
              style={{ height: "45px" }}
            >
              <path
                d="M 0 30 Q 50 10, 100 25 T 200 15 T 300 5"
                fill="none"
                stroke="var(--color-teal-accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="text-center">
              <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                Atualizado em tempo real
              </small>
            </div>
          </div>

          <p
            className="text-center text-muted small mb-3 px-2"
            style={{ fontSize: "0.8rem" }}
          >
            {abaAtiva === "resumo" &&
              "Acompanhe o total recebido em orçamentos devidamente assinados pelos clientes."}
            {abaAtiva === "desempenho" &&
              "Propostas enviadas pelo WhatsApp que aguardam a assinatura do cliente."}
            {abaAtiva === "conversao" &&
              `Você fechou ${totalAprovados} de ${totalOrcamentos} propostas criadas até o momento.`}
          </p>

          <button
            onClick={() => router.push("/orcamento/novo")}
            className="btn text-white btn-lg rounded-pill fw-bold w-100 shadow-sm py-2"
            style={{
              backgroundColor: "var(--color-teal-accent)",
              borderColor: "var(--color-teal-accent)",
            }}
          >
            Criar Novo Orçamento
          </button>
        </div>

        {/* Métricas Detalhadas em Grelha */}
        <div>
          <h3 className="h6 fw-bold text-dark mb-3">Métricas Detalhadas</h3>
          <div className="row g-3">
            {/* Card 1: Em Negociação */}
            <div className="col-6">
              <div className="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
                <small
                  className="text-muted fw-semibold d-block mb-1"
                  style={{ fontSize: "0.7rem" }}
                >
                  Em Negociação
                </small>
                <div className="h5 fw-black text-dark mb-1">
                  R${" "}
                  {faturamentoPendente.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div
                  className="d-flex align-items-center gap-1 text-warning fw-bold"
                  style={{ fontSize: "0.75rem" }}
                >
                  <i className="bi bi-clock-history"></i>
                  <span>{totalPendentes} aguardando</span>
                </div>
              </div>
            </div>

            {/* Card 2: Taxa de Aceitação */}
            <div className="col-6">
              <div className="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
                <small
                  className="text-muted fw-semibold d-block mb-1"
                  style={{ fontSize: "0.7rem" }}
                >
                  Taxa de Aceitação
                </small>
                <div className="h5 fw-black text-dark mb-1">
                  {taxaConversao}%
                </div>
                <div
                  className="d-flex align-items-center gap-1 text-success fw-bold"
                  style={{ fontSize: "0.75rem" }}
                >
                  <i className="bi bi-graph-up-arrow"></i>
                  <span>{totalAprovados} de {totalOrcamentos} fechados</span>
                </div>
              </div>
            </div>

            {/* Card 3: Ticket Médio */}
            <div className="col-6">
              <div className="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
                <small
                  className="text-muted fw-semibold d-block mb-1"
                  style={{ fontSize: "0.7rem" }}
                >
                  Ticket Médio / Obra
                </small>
                <div className="h5 fw-black text-dark mb-1">
                  R${" "}
                  {ticketMedio.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </div>
                <div
                  className="d-flex align-items-center gap-1 text-primary fw-bold"
                  style={{ fontSize: "0.75rem" }}
                >
                  <i className="bi bi-calculator"></i>
                  <span>Média por contrato</span>
                </div>
              </div>
            </div>

            {/* Card 4: Propostas Expiradas */}
            <div className="col-6">
              <div className="card border-0 shadow-sm rounded-4 bg-white p-3 h-100">
                <small
                  className="text-muted fw-semibold d-block mb-1"
                  style={{ fontSize: "0.7rem" }}
                >
                  Propostas Expiradas
                </small>
                <div className="h5 fw-black text-dark mb-1">
                  {totalExpirados}
                </div>
                <div
                  className="d-flex align-items-center gap-1 text-danger fw-bold"
                  style={{ fontSize: "0.75rem" }}
                >
                  <i className="bi bi-x-circle"></i>
                  <span>Sem assinatura</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}