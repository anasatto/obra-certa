"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [modoCadastro, setModoCadastro] = useState(false);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nomeEmpresa, setNomeEmpresa] = useState("");
  const [telefone, setTelefone] = useState("");

  const [loading, setLoading] = useState(false);
  const [erroMsg, setErroMsg] = useState("");
  const [sucessoMsg, setSucessoMsg] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErroMsg("");
    setSucessoMsg("");

    try {
      if (modoCadastro) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
        });

        if (error) throw error;

        if (data.user) {
          await supabase.from("profiles").insert([
            {
              id: data.user.id,
              business_name: nomeEmpresa,
              phone: telefone.replace(/\D/g, ""),
            },
          ]);

          setSucessoMsg("Conta criada com sucesso! Redirecionando...");
          setTimeout(() => {
            router.push("/orcamentos");
          }, 1500);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });

        if (error) throw error;

        router.push("/orcamentos");
      }
    } catch (error: any) {
      if (error.message === "Failed to fetch") {
        setErroMsg(
          "Erro de conexão. Verifique suas chaves no arquivo .env.local e reinicie o servidor."
        );
      } else {
        setErroMsg(
          error.message || "Falha na autenticação. Tente novamente."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div
        className="card border-0 shadow-lg overflow-hidden w-100 bg-white"
        style={{ maxWidth: "400px", borderRadius: "28px" }}
      >
        {/* Topo Ondulado - Estilo Elegante Alinhado com a Nova Paleta */}
        <div
          className="text-white px-4 pt-4 pb-5 text-center position-relative shadow-sm"
          style={{
            backgroundColor: "var(--color-teal-dark)",
            borderBottomLeftRadius: "50% 20px",
            borderBottomRightRadius: "50% 20px",
          }}
        >
          <div
            className="rounded-circle d-flex align-items-center justify-content-center fw-black fs-4 mx-auto mb-2 shadow"
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "var(--color-teal-accent)",
              color: "#ffffff",
              border: "3px solid #ffffff",
            }}
          >
            OC
          </div>
          <h1 className="h5 fw-black mb-0 text-white tracking-tight">
            ObraCerta
          </h1>
          <small
            className="text-white-50 fw-medium"
            style={{ fontSize: "0.8rem" }}
          >
            {modoCadastro
              ? "Criar sua conta profissional"
              : "Acesse sua conta para continuar"}
          </small>
        </div>

        <div className="card-body p-4 pt-3">
          {erroMsg && (
            <div className="alert alert-danger border-0 rounded-4 small py-2 d-flex align-items-center gap-2 mb-3 shadow-sm">
              <i className="bi bi-exclamation-circle-fill fs-5"></i>
              <span>{erroMsg}</span>
            </div>
          )}

          {sucessoMsg && (
            <div className="alert alert-success border-0 rounded-4 small py-2 d-flex align-items-center gap-2 mb-3 shadow-sm">
              <i className="bi bi-check-circle-fill fs-5"></i>
              <span>{sucessoMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="d-flex flex-column gap-3">
            {modoCadastro && (
              <>
                <div className="form-floating">
                  <input
                    id="nomeEmpresa"
                    type="text"
                    className="form-control rounded-4 border-light-subtle bg-light"
                    placeholder="Nome da sua Empresa/Marca"
                    value={nomeEmpresa}
                    onChange={(e) => setNomeEmpresa(e.target.value)}
                    required
                  />
                  <label htmlFor="nomeEmpresa" className="text-muted">
                    <i className="bi bi-briefcase me-1"></i> Nome da Marca / Empresa
                  </label>
                </div>

                <div className="form-floating">
                  <input
                    id="telefone"
                    type="tel"
                    className="form-control rounded-4 border-light-subtle bg-light"
                    placeholder="Seu WhatsApp"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                  />
                  <label htmlFor="telefone" className="text-muted">
                    <i className="bi bi-whatsapp me-1"></i> Seu WhatsApp
                  </label>
                </div>
              </>
            )}

            <div className="form-floating">
              <input
                id="email"
                type="email"
                className="form-control rounded-4 border-light-subtle bg-light"
                placeholder="Seu E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email" className="text-muted">
                <i className="bi bi-envelope me-1"></i> Seu E-mail
              </label>
            </div>

            <div className="form-floating">
              <input
                id="senha"
                type="password"
                className="form-control rounded-4 border-light-subtle bg-light"
                placeholder="Sua Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                minLength={6}
                required
              />
              <label htmlFor="senha" className="text-muted">
                <i className="bi bi-lock me-1"></i> Senha (mínimo 6 dígitos)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn text-white btn-lg rounded-pill fw-bold shadow-sm mt-2 py-3"
              style={{
                backgroundColor: "var(--color-teal-accent)",
                borderColor: "var(--color-teal-accent)",
              }}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
              ) : modoCadastro ? (
                "Criar Minha Conta"
              ) : (
                "Entrar no Sistema"
              )}
            </button>
          </form>

          <div className="text-center mt-4 pt-3 border-top border-light-subtle">
            <p className="small text-muted mb-1">
              {modoCadastro
                ? "Já possui uma conta?"
                : "Ainda não tem conta no ObraCerta?"}
            </p>
            <button
              type="button"
              onClick={() => {
                setModoCadastro(!modoCadastro);
                setErroMsg("");
                setSucessoMsg("");
              }}
              className="btn btn-link fw-bold text-decoration-none p-0 small"
              style={{ color: "var(--color-teal-dark)" }}
            >
              {modoCadastro ? "Fazer Login" : "Criar uma conta grátis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}