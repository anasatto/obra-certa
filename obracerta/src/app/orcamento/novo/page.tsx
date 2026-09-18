"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ItemOrcamento {
  id: string;
  descricao: string;
  valor: number;
}

export default function NovoOrcamentoPage() {
  const router = useRouter();

  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [validadeDias, setValidadeDias] = useState("7");
  const [itens, setItens] = useState<ItemOrcamento[]>([
    { id: "1", descricao: "", valor: 0 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const adicionarItem = () => {
    setItens([
      ...itens,
      { id: Date.now().toString(), descricao: "", valor: 0 },
    ]);
  };

  const removerItem = (id: string) => {
    if (itens.length === 1) return;
    setItens(itens.filter((item) => item.id !== id));
  };

  const atualizarItem = (
    id: string,
    campo: "descricao" | "valor",
    valor: string
  ) => {
    setItens(
      itens.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [campo]: campo === "valor" ? parseFloat(valor) || 0 : valor,
          };
        }
        return item;
      })
    );
  };

  const valorTotal = itens.reduce((acc, item) => acc + item.valor, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orcamentoId = "orc-" + Math.random().toString(36).substring(2, 7);
      const dataHoje = new Date().toLocaleDateString("pt-BR");

      const novoOrcamento = {
        id: orcamentoId,
        clienteNome: nomeCliente,
        clienteTelefone: telefoneCliente.replace(/\D/g, ""),
        dataCriacao: dataHoje,
        valorTotal: valorTotal,
        status: "pendente",
        itens: itens,
        validadeDias: validadeDias,
      };

      const orcamentosExistentes = JSON.parse(
        localStorage.getItem("obracerta_orcamentos") || "[]"
      );
      const listaAtualizada = [novoOrcamento, ...orcamentosExistentes];
      localStorage.setItem(
        "obracerta_orcamentos",
        JSON.stringify(listaAtualizada)
      );

      const linkPublico = `${window.location.origin}/o/${orcamentoId}`;
      const mensagem = encodeURIComponent(
        `Olá *${nomeCliente}*!\n\n` +
          `Segue o orçamento detalhado dos serviços. Você pode conferir os itens e assinar digitalmente pelo link abaixo:\n\n` +
          `🔗 ${linkPublico}\n\n` +
          `💰 *Valor Total:* R$ ${valorTotal.toFixed(2)}\n` +
          `⏳ *Garantia deste preço:* Mantido por ${validadeDias} dias`
      );

      const whatsappUrl = `https://api.whatsapp.com/send?phone=55${novoOrcamento.clienteTelefone}&text=${mensagem}`;
      window.open(whatsappUrl, "_blank");

      router.push("/orcamentos");
    } catch (error) {
      alert("Erro ao salvar o orçamento.");
    } finally {
      setIsSubmitting(false);
    }
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
                Novo Orçamento
              </small>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/orcamentos")}
            className="btn btn-outline-light btn-sm rounded-pill fw-semibold px-3"
          >
            Meus Orçamentos
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
              className="list-group-item list-group-item-action bg-transparent text-white border-0 px-3 py-3 d-flex align-items-center gap-3 fw-bold active"
            >
              <i className="bi bi-plus-circle text-warning fs-5"></i>
              <span>Novo Orçamento</span>
            </button>
            <button
              onClick={() => router.push("/orcamentos")}
              data-bs-dismiss="offcanvas"
              className="list-group-item list-group-item-action bg-transparent text-white border-0 px-3 py-3 d-flex align-items-center gap-3"
            >
              <i className="bi bi-file-earmark-text text-warning fs-5"></i>
              <span>Meus Orçamentos</span>
            </button>
          </div>
        </div>
      </div>

      <main className="container py-3 px-3" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-0 pt-3 pb-0 px-3">
              <span className="badge bg-warning text-dark fw-bold px-2 py-1 mb-1">
                Passo 1 de 2
              </span>
              <h2 className="h6 fw-bold mb-0 text-dark">
                Quem vai receber o orçamento?
              </h2>
            </div>
            <div className="card-body p-3">
              <div className="form-floating mb-3">
                <input
                  id="nomeCliente"
                  type="text"
                  className="form-control rounded-3 border-light-subtle bg-light"
                  placeholder="Nome do Cliente"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  required
                />
                <label htmlFor="nomeCliente" className="text-muted">
                  <i className="bi bi-person me-1"></i> Nome do Cliente
                </label>
              </div>

              <div className="row g-2">
                <div className="col-7">
                  <div className="form-floating">
                    <input
                      id="telefoneCliente"
                      type="tel"
                      className="form-control rounded-3 border-light-subtle bg-light"
                      placeholder="WhatsApp"
                      value={telefoneCliente}
                      onChange={(e) => setTelefoneCliente(e.target.value)}
                      required
                    />
                    <label htmlFor="telefoneCliente" className="text-muted">
                      <i className="bi bi-whatsapp me-1"></i> WhatsApp
                    </label>
                  </div>
                </div>

                <div className="col-5">
                  <div className="form-floating">
                    <select
                      id="validadeDias"
                      className="form-select rounded-3 border-light-subtle bg-light text-dark fw-medium"
                      value={validadeDias}
                      onChange={(e) => setValidadeDias(e.target.value)}
                    >
                      <option value="3">3 dias</option>
                      <option value="7">7 dias</option>
                      <option value="15">15 dias</option>
                      <option value="30">30 dias</option>
                    </select>
                    <label htmlFor="validadeDias" className="text-muted">
                      Garantia Preço
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-0 pt-3 pb-2 px-3 d-flex justify-content-between align-items-center">
              <div>
                <span className="badge bg-warning text-dark fw-bold px-2 py-1 mb-1">
                  Passo 2 de 2
                </span>
                <h2 className="h6 fw-bold mb-0 text-dark">
                  Serviços e Materiais
                </h2>
              </div>
              <button
                type="button"
                onClick={adicionarItem}
                className="btn btn-warning text-dark btn-sm rounded-pill fw-bold px-3 shadow-sm"
              >
                <i className="bi bi-plus-lg me-1"></i> Item
              </button>
            </div>

            <div className="card-body p-3 d-flex flex-column gap-2">
              {itens.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 bg-light rounded-3 border border-light-subtle position-relative"
                >
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge bg-secondary-subtle text-secondary fw-semibold">
                      Item #{index + 1}
                    </span>
                    {itens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removerItem(item.id)}
                        className="btn btn-sm btn-outline-danger border-0 p-0 px-2"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>

                  <div className="form-floating mb-2">
                    <input
                      type="text"
                      className="form-control bg-white border-0 shadow-sm rounded-3"
                      placeholder="Descrição do serviço"
                      value={item.descricao}
                      onChange={(e) =>
                        atualizarItem(item.id, "descricao", e.target.value)
                      }
                      required
                    />
                    <label className="text-muted">
                      Descrição (Mão de obra ou material)
                    </label>
                  </div>

                  <div className="input-group">
                    <span className="input-group-text bg-white border-0 shadow-sm fw-bold text-muted">
                      R$
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control bg-white border-0 shadow-sm rounded-end-3 fw-bold text-dark fs-5"
                      placeholder="0,00"
                      value={item.valor || ""}
                      onChange={(e) =>
                        atualizarItem(item.id, "valor", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ height: "90px" }}></div>

          <div className="fixed-bottom bg-white border-top shadow-lg p-3">
            <div
              className="container p-0 d-flex align-items-center justify-content-between"
              style={{ maxWidth: "500px" }}
            >
              <div>
                <small
                  className="text-muted d-block text-uppercase font-monospace"
                  style={{ fontSize: "0.7rem" }}
                >
                  TOTAL ESTIMADO
                </small>
                <span className="h4 mb-0 fw-black text-dark">
                  R${" "}
                  {valorTotal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-success btn-lg rounded-pill fw-bold px-4 shadow d-flex align-items-center gap-2"
              >
                {isSubmitting ? (
                  <span>Gerando...</span>
                ) : (
                  <>
                    <i className="bi bi-whatsapp fs-5"></i>
                    <span>Enviar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}