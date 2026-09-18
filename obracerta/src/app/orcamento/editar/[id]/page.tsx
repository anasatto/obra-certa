"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface ItemOrcamento {
  id: string;
  descricao: string;
  valor: number;
}

interface OrcamentoData {
  id: string;
  clienteNome: string;
  clienteTelefone: string;
  dataCriacao: string;
  valorTotal: number;
  status: "pendente" | "aprovado" | "expirado";
  itens: ItemOrcamento[];
  validadeDias: string;
}

export default function EditarOrcamentoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [validadeDias, setValidadeDias] = useState("7");
  const [itens, setItens] = useState<ItemOrcamento[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!id) return;

    const dadosSalvos = localStorage.getItem("obracerta_orcamentos");
    if (dadosSalvos) {
      const lista: OrcamentoData[] = JSON.parse(dadosSalvos);
      const encontrado = lista.find((o) => o.id === id);
      if (encontrado) {
        setNomeCliente(encontrado.clienteNome);
        setTelefoneCliente(encontrado.clienteTelefone);
        setValidadeDias(encontrado.validadeDias || "7");
        setItens(encontrado.itens || [{ id: "1", descricao: "", valor: 0 }]);
      }
    }
    setCarregando(false);
  }, [id]);

  const adicionarItem = () => {
    setItens([
      ...itens,
      { id: Date.now().toString(), descricao: "", valor: 0 },
    ]);
  };

  const removerItem = (itemId: string) => {
    if (itens.length === 1) return;
    setItens(itens.filter((item) => item.id !== itemId));
  };

  const atualizarItem = (
    itemId: string,
    campo: "descricao" | "valor",
    valor: string
  ) => {
    setItens(
      itens.map((item) => {
        if (item.id === itemId) {
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
      const dadosSalvos = localStorage.getItem("obracerta_orcamentos");
      if (!dadosSalvos) return;

      const lista: OrcamentoData[] = JSON.parse(dadosSalvos);

      const orcamentoAtualizado: OrcamentoData = {
        id: id,
        clienteNome: nomeCliente,
        clienteTelefone: telefoneCliente.replace(/\D/g, ""),
        dataCriacao: new Date().toLocaleDateString("pt-BR"),
        valorTotal: valorTotal,
        status: "pendente",
        itens: itens,
        validadeDias: validadeDias,
      };

      const listaAtualizada = lista.map((o) =>
        o.id === id ? orcamentoAtualizado : o
      );
      localStorage.setItem(
        "obracerta_orcamentos",
        JSON.stringify(listaAtualizada)
      );

      const linkPublico = `${window.location.origin}/o/${id}`;
      const mensagem = encodeURIComponent(
        `Olá *${nomeCliente}*!\n\n` +
          `Atualizamos o orçamento dos seus serviços. Você pode conferir os novos itens e assinar digitalmente pelo link abaixo:\n\n` +
          `🔗 ${linkPublico}\n\n` +
          `💰 *Valor Total:* R$ ${valorTotal.toFixed(2)}\n` +
          `⏳ *Garantia deste preço:* Mantido por ${validadeDias} dias`
      );

      const whatsappUrl = `https://api.whatsapp.com/send?phone=55${orcamentoAtualizado.clienteTelefone}&text=${mensagem}`;
      window.open(whatsappUrl, "_blank");

      router.push("/orcamentos");
    } catch (error) {
      alert("Erro ao atualizar o orçamento.");
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <div className="bg-light min-vh-100 pb-5">
      <header className="bg-dark text-white sticky-top shadow-sm border-bottom border-warning border-3 px-3 py-3">
        <div
          className="container p-0 d-flex align-items-center justify-content-between"
          style={{ maxWidth: "500px" }}
        >
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-outline-light btn-sm rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              <i className="bi bi-arrow-left fs-5"></i>
            </button>
            <div>
              <h1 className="h6 mb-0 fw-bold text-uppercase">ObraCerta</h1>
              <small className="text-warning" style={{ fontSize: "0.75rem" }}>
                Editar Orçamento
              </small>
            </div>
          </div>
          <span className="badge bg-secondary font-monospace">{id}</span>
        </div>
      </header>

      <main className="container py-3 px-3" style={{ maxWidth: "500px" }}>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-0 pt-3 pb-0 px-3">
              <h2 className="h6 fw-bold mb-0 text-dark">Dados do Cliente</h2>
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
              <h2 className="h6 fw-bold mb-0 text-dark">Serviços e Materiais</h2>
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
                    <label className="text-muted">Descrição</label>
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
                  NOVO TOTAL
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
                  <span>Salvando...</span>
                ) : (
                  <>
                    <i className="bi bi-whatsapp fs-5"></i>
                    <span>Salvar & Reenviar</span>
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