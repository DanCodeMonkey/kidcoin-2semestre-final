"use client";

import { useEffect, useState } from "react";
import NavbarProfessor from "../components/NavbarProfessor";
import TertiaryBtn from "../components/TertiaryBtn";
import Footer from "../components/Footer";

interface Aluno {
  id: number;
  nome: string;
  apelido: string;
  dataNascimento: string;
  email: string;
  turma: number | null;
}

interface Sala {
  id: number;
  nome: string;
}

export default function AdicionarAluno() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(null);
  const [novaSala, setNovaSala] = useState("");
  const [expandedSalaId, setExpandedSalaId] = useState<number | null>(null);
  const [filtroAluno, setFiltroAluno] = useState("");

  // Carregar alunos e salas
  const carregar = async () => {
    const res = await fetch("/api/aluno");
    const data = await res.json();
    setAlunos(data.alunos || []);
    setSalas(data.salas || []);
  };

  useEffect(() => {
    carregar();
  }, []);

  // Criar sala
  const criarSala = async () => {
    if (!novaSala.trim()) return alert("Digite o nome da sala");
    const res = await fetch("/api/aluno", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novaSala }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Erro ao criar sala");
    setNovaSala("");
    carregar();
  };

  // Colocar aluno na sala
  const colocarAlunoNaSala = async (salaId: number) => {
    if (!alunoSelecionado) return alert("Selecione um aluno primeiro");

    const aluno = alunos.find((a) => a.id === alunoSelecionado);
    if (!aluno) return alert("Aluno não encontrado");

    if (aluno.turma && aluno.turma !== salaId) {
      return alert("Este aluno já está em outra sala. Remova-o antes de adicionar.");
    }

    const res = await fetch("/api/aluno", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alunoId: alunoSelecionado, salaId }),
    });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Erro ao adicionar aluno");
    carregar();
    setExpandedSalaId(salaId); // ao colocar, já expande a sala
  };

  // Remover aluno da sala
  const removerAlunoDaSala = async (alunoId: number) => {
    const res = await fetch(`/api/aluno?alunoId=${alunoId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Erro ao remover aluno");
    carregar();
  };

  // Excluir sala
  const excluirSala = async (salaId: number) => {
    const confirm = window.confirm("Deseja realmente excluir esta sala?");
    if (!confirm) return;

    const res = await fetch(`/api/aluno?salaId=${salaId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) return alert(data.message || "Erro ao excluir sala");
    if (expandedSalaId === salaId) setExpandedSalaId(null);
    carregar();
  };

  // Expandir / fechar sala
  const verSala = (salaId: number) => {
    setExpandedSalaId(expandedSalaId === salaId ? null : salaId);
  };

  // Contar alunos em cada sala
  const contarAlunos = (salaId: number) => alunos.filter((a) => a.turma === salaId).length;

  const aluno = alunos.find((a) => a.id === alunoSelecionado);
  const salaAtual = salas.find((s) => s.id === aluno?.turma || -1) || null;

  return (
    <>
      <NavbarProfessor />
      <span className="p-4">
        <a href="/dashboard">❮❮ voltar</a>
      </span>

      <div className="flex justify-center h-[80vh]">
        <div className="max-w-5xl w-full mt-10 p-6 rounded-lg">
          <h2 className="text-4xl font-bold mb-6 text-center">Gerenciar Alunos e Salas</h2>

          {/* Barra de pesquisa */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Pesquisar aluno..."
              value={filtroAluno}
              onChange={(e) => setFiltroAluno(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Lista de cards de alunos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto mb-6">
            {alunos
              .filter(
                (a) =>
                  a.nome.toLowerCase().includes(filtroAluno.toLowerCase()) ||
                  a.apelido.toLowerCase().includes(filtroAluno.toLowerCase())
              )
              .map((a) => (
                <div
                  key={a.id}
                  onClick={() => setAlunoSelecionado(a.id)}
                  className={`p-3 border rounded cursor-pointer transition ${
                    alunoSelecionado === a.id
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <p className="font-semibold">{a.nome} ({a.apelido})</p>
                  {a.turma && (
                    <p className="text-sm text-gray-500">
                      Sala: {salas.find((s) => s.id === a.turma)?.nome}
                    </p>
                  )}
                </div>
              ))}
          </div>

          {/* Criar sala */}
          <div className="flex gap-3 mb-6">
            <input
              className="flex-1 p-2 border rounded"
              placeholder="Nova sala..."
              value={novaSala}
              onChange={(e) => setNovaSala(e.target.value)}
            />
            <TertiaryBtn onClick={criarSala}>Criar sala</TertiaryBtn>
          </div>

          {/* Grid de salas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {salas.map((s) => {
              const qtd = contarAlunos(s.id);
              return (
                <div key={s.id} className="border rounded-lg p-4 shadow-sm bg-white flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">{s.nome}</h3>
                    <span className="text-sm text-gray-500">{qtd} aluno(s)</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => colocarAlunoNaSala(s.id)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Colocar aluno nesta sala
                    </button>

                    <button
                      onClick={() => verSala(s.id)}
                      className="px-3 py-2 border rounded hover:bg-gray-50"
                    >
                      {expandedSalaId === s.id ? "Fechar" : "Ver sala"}
                    </button>

                    <button
                      onClick={() => excluirSala(s.id)}
                      className={`px-3 py-2 rounded ${
                        qtd === 0
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-gray-200 text-gray-600 cursor-not-allowed"
                      }`}
                      disabled={qtd > 0}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Área expandida da sala */}
          {expandedSalaId !== null && (
            <div className="mt-8 p-6 border rounded bg-gray-50 shadow-inner">
              <h3 className="text-2xl font-bold mb-4">
                {salas.find((s) => s.id === expandedSalaId)?.nome}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {alunos.filter((a) => a.turma === expandedSalaId).length === 0 && (
                  <p className="text-gray-500">Nenhum aluno nesta sala.</p>
                )}

                {alunos
                  .filter((a) => a.turma === expandedSalaId)
                  .map((a) => (
                    <div key={a.id} className="border rounded-lg p-4 bg-white shadow">
                      <h4 className="text-lg font-semibold mb-2">{a.nome} ({a.apelido})</h4>
                      <p className="text-sm"><span className="font-medium">Email:</span> {a.email}</p>
                      <p className="text-sm"><span className="font-medium">Nascimento:</span> {a.dataNascimento}</p>
                      <p className="text-sm"><span className="font-medium">ID:</span> {a.id}</p>

                      <button
                        onClick={() => removerAlunoDaSala(a.id)}
                        className="mt-3 w-full px-3 py-2 bg-gray-700 text-white rounded"
                      >
                        Remover da sala
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Card do aluno selecionado */}
          <div className="mt-8 p-4 border rounded bg-white">
            {!aluno ? (
              <p className="text-gray-500">Selecione um aluno para ver o status</p>
            ) : (
              <div>
                <h3 className="text-xl font-semibold">Aluno: {aluno.nome} ({aluno.apelido})</h3>
                {aluno.turma ? (
                  <p className="text-sm text-gray-600">
                    Atualmente na sala: <span className="font-medium">
                      {salas.find((s) => s.id === aluno.turma)?.nome ?? "Não encontrada"}
                    </span>
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">Este aluno ainda está sem sala.</p>
                )}
                {aluno.turma && (
                  <button
                    onClick={() => removerAlunoDaSala(aluno.id)}
                    className="mt-3 px-3 py-2 bg-gray-700 text-white rounded"
                  >
                    Remover da sala atual
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
