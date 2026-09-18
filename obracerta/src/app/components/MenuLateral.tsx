"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function MenuLateral() {
  const router = useRouter();
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("profissional@obracerta.com");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className="offcanvas offcanvas-start border-0 shadow-lg overflow-hidden offcanvas-menu-custom"
      tabIndex={-1}
      id="menuLateral"
      style={{ maxWidth: "310px" }}
    >
      {/* Topo Curvado com Identificação do Usuário */}
      <div className="menu-header-curved px-4 pt-4 pb-5 text-center position-relative shadow-sm">
        <button
          type="button"
          className="btn-close btn-close-white position-absolute top-0 end-0 m-3 opacity-75"
          data-bs-dismiss="offcanvas"
          aria-label="Fechar"
        ></button>

        <div
          className="rounded-circle d-flex align-items-center justify-content-center fw-bold fs-4 mx-auto mb-2 shadow-sm"
          style={{
            width: "64px",
            height: "64px",
            backgroundColor: "#f0f3f3",
            color: "var(--color-beige-sand)",
            border: "2px solid var(--color-teal-accent)",
          }}
        >
          {userEmail.substring(0, 2).toUpperCase()}
        </div>

        <h2 className="h6 fw-bold mb-0 text-white text-truncate px-2">
          {userEmail.split("@")[0]}
        </h2>
        <small className="text-brand-sand fw-medium" style={{ fontSize: "0.75rem" }}>
          Profissional ObraCerta
        </small>
      </div>

      {/* Corpo do Menu com Categorias */}
      <div className="offcanvas-body px-3 py-4 d-flex flex-column justify-content-between">
        <div className="d-flex flex-column gap-3">
          {/* Seção Geral */}
          <div>
            <small
              className="text-muted fw-bold text-uppercase px-3 d-block mb-2"
              style={{ fontSize: "0.65rem", letterSpacing: "1.2px" }}
            >
              Geral
            </small>
            <div className="d-flex flex-column gap-1">
              <button
                onClick={() => router.push("/metricas")}
                data-bs-dismiss="offcanvas"
                className={`btn text-start w-100 rounded-pill px-3 py-2 d-flex align-items-center gap-3 menu-btn-item ${
                  isActive("/metricas") ? "active" : ""
                }`}
              >
                <i className="bi bi-graph-up-arrow fs-5"></i>
                <span className="small fw-medium">Dashboard</span>
              </button>

              <button
                onClick={() => router.push("/orcamento/novo")}
                data-bs-dismiss="offcanvas"
                className={`btn text-start w-100 rounded-pill px-3 py-2 d-flex align-items-center gap-3 menu-btn-item ${
                  isActive("/orcamento/novo") ? "active" : ""
                }`}
              >
                <i className="bi bi-plus-circle fs-5"></i>
                <span className="small fw-medium">Novo Orçamento</span>
              </button>
            </div>
          </div>

          <hr className="border-secondary opacity-10 my-1" />

          {/* Seção Gestão */}
          <div>
            <small
              className="text-muted fw-bold text-uppercase px-3 d-block mb-2"
              style={{ fontSize: "0.65rem", letterSpacing: "1.2px" }}
            >
              Gestão
            </small>
            <div className="d-flex flex-column gap-1">
              <button
                onClick={() => router.push("/orcamentos")}
                data-bs-dismiss="offcanvas"
                className={`btn text-start w-100 rounded-pill px-3 py-2 d-flex align-items-center gap-3 menu-btn-item ${
                  isActive("/orcamentos") ? "active" : ""
                }`}
              >
                <i className="bi bi-file-earmark-text fs-5"></i>
                <span className="small fw-medium">Meus Orçamentos</span>
              </button>

            </div>
          </div>
        </div>

        {/* Rodapé com Botão Sair */}
        <div className="pt-3 border-top border-secondary border-opacity-10">
          <button
            onClick={handleLogout}
            data-bs-dismiss="offcanvas"
            className="btn btn-link text-danger text-decoration-none w-100 text-start px-3 py-2 d-flex align-items-center gap-3 fw-semibold border-0 opacity-75 hover-opacity-100"
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
            <span className="small">Sair da Conta</span>
          </button>
        </div>
      </div>
    </div>
  );
}