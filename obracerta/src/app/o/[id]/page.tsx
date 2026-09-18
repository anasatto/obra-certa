"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SignatureCanvas from "../../components/SignatureCanvas";

interface Item {
  id: string;
  descricao: string;
  valor: number;
}

interface OrcamentoData {
  id: string;
  clienteNome: string;
  dataCriacao: string;
  valorTotal: number;
  status: "pendente" | "aprovado" | "expirado";
  itens: Item[];
  validadeDias: string;
  assinaturaUrl?: string;
}

export default function ClienteAssinaturaPage() {
  const params = useParams();
  const id = params?.id as string;

  const [orcamento, setOrcamento] = useState<OrcamentoData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [assinadoSucesso, setAssinadoSucesso] = useState(false);

  useEffect(() => {
    if (!id) return;

    const dadosSalvos = localStorage.getItem("obracerta_orcamentos");
    if (dadosSalvos) {
      const lista: OrcamentoData[] = JSON.parse(dadosSalvos);
      const encontrado = lista.find((o) => o.id === id);
      if (encontrado) {
        setOrcamento(encontrado);
      }
    }
    setCarregando(false);
  }, [id]);

  const handleConfirmarAssinatura = (base64Image: string) => {
    if (!orcamento) return;

    const orcamentoAtualizado: OrcamentoData = {
      ...orcamento,
      status: "aprovado",
      assinaturaUrl: base64Image,
    };

    const dadosSalvos = localStorage.getItem("obracerta_orcamentos");
    if (dadosSalvos) {
      const lista: OrcamentoData[] = JSON.parse(dadosSalvos);
      const listaAtualizada = lista.map((o) =>
        o.id === id ? orcamentoAtualizado : o
      );
      localStorage.setItem(
        "obracerta_orcamentos",
        JSON.stringify(listaAtualizada)
      );
    }

    setOrcamento(orcamentoAtualizado);
    setAssinadoSucesso(true);
  };

  if (carregando) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!orcamento) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
        <div className="card border-0 shadow-sm rounded-4 p-4 text-center">
          <i className="bi bi-exclamation-triangle text-warning display-4 mb-2"></i>
          <h1 className="h6 fw-bold">Orçamento não encontrado</h1>
          <p className="text-muted small mb-0">
            Verifique o link enviado pelo profissional ou solicite um novo envio.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      <header className="bg-dark text-white sticky-top shadow-sm border-bottom border-warning border-3 px-3 py-3">
        <div
          className="container p-0 d-flex align-items-center justify-content-between"
          style={{ maxWidth: "500px" }}
        >
          <div>
            <h1 className="h6 mb-0 fw-bold text-uppercase">Proposta de Serviço</h1>
            <small className="text-warning" style={{ fontSize: "0.75rem" }}>
              Aprovação Digital
            </small>
          </div>
          <span className="badge bg-secondary font-monospace">{orcamento.id}</span>
        </div>
      </header>

      <main className="container py-3 px-3" style={{ maxWidth: "500px" }}>
        {assinadoSucesso || orcamento.status === "aprovado" ? (
          <div className="card border-0 shadow-sm rounded-4 bg-success text-white p-4 text-center mb-3">
            <i className="bi bi-check-circle-fill display-3 mb-2"></i>
            <h2 className="h5 fw-bold mb-1">Orçamento Aprovado!</h2>
            <p className="small mb-3 text-white-50">
              Sua assinatura foi registrada com sucesso. O profissional já foi notificado.
            </p>
            {orcamento.assinaturaUrl && (
              <div className="bg-white rounded-3 p-2 d-inline-block mx-auto border">
                <small className="text-dark d-block mb-1 fw-bold" style={{ fontSize: "0.65rem" }}>
                  SUA ASSINATURA:
                </small>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={orcamento.assinaturaUrl}
                  alt="Assinatura"
                  style={{ maxHeight: "80px" }}
                />
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
              <div className="card-body p-3">
                <small className="text-muted d-block font-monospace mb-1" style={{ fontSize: "0.7rem" }}>
                  ORÇAMENTO PARA
                </small>
                <h2 className="h5 fw-bold text-dark mb-1">{orcamento.clienteNome}</h2>
                <small className="text-muted d-block">
                  <i className="bi bi-calendar3 me-1"></i> Emitido em {orcamento.dataCriacao} •
                  Garantia do preço: {orcamento.validadeDias} dias
                </small>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
              <div className="card-header bg-white border-0 pt-3 pb-0 px-3">
                <h3 className="h6 fw-bold mb-0 text-dark">
                  <i className="bi bi-list-check me-2 text-warning"></i>Itens do Serviço
                </h3>
              </div>
              <div className="card-body p-3 d-flex flex-column gap-2">
                {orcamento.itens.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="d-flex justify-content-between align-items-center p-2 bg-light rounded-3 border-light-subtle"
                  >
                    <span className="small text-dark fw-medium">{item.descricao}</span>
                    <span className="fw-bold text-dark ms-2">
                      R$ {item.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}

                <div className="d-flex justify-content-between align-items-center pt-2 mt-2 border-top border-2">
                  <span className="fw-bold text-dark">TOTAL:</span>
                  <span className="h4 mb-0 fw-black text-success">
                    R$ {orcamento.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-3">
              <div className="card-body p-3">
                <SignatureCanvas onConfirm={handleConfirmarAssinatura} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}