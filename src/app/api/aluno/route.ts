import { NextResponse } from "next/server";

// ==========================
//   BANCO EM MEMÓRIA
// ==========================

interface Aluno {
  id: number;
  nome: string;
  apelido: string;
  dataNascimento: string;
  email: string;
  senha: string;
  turma: number | null; // id da sala ou null
}

interface Sala {
  id: number;
  nome: string;
}

let alunos: Aluno[] = [];
let salas: Sala[] = [
  { id: 1, nome: "Sala A" },
  { id: 2, nome: "Sala B" },
];

let ultimoIdAluno = 0;
let ultimoIdSala = 2;

/**
 * GET /
 * - sem query: retorna { alunos, salas } (alunos sem senha)
 * - ?salaId=ID : retorna { alunosDaSala, sala } (alunos sem senha)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const salaIdParam = searchParams.get("salaId");

  const alunosSemSenha = alunos.map(({ senha, ...rest }) => rest);

  if (salaIdParam) {
    const salaId = Number(salaIdParam);
    const sala = salas.find((s) => s.id === salaId);
    if (!sala) {
      return NextResponse.json({ message: "Sala não encontrada" }, { status: 404 });
    }
    const alunosDaSala = alunosSemSenha.filter((a: any) => a.turma === salaId);
    return NextResponse.json({ sala, alunosDaSala });
  }

  return NextResponse.json({ alunos: alunosSemSenha, salas });
}

/**
 * POST /
 * - criar aluno (body: { nome, apelido, dataNascimento, email, senha })
 */
export async function POST(request: Request) {
  const { nome, apelido, dataNascimento, email, senha } = await request.json();

  const novo: Aluno = {
    id: ++ultimoIdAluno,
    nome,
    apelido,
    dataNascimento,
    email,
    senha,
    turma: null,
  };

  alunos.push(novo);
  const { senha: _, ...semSenha } = novo;
  return NextResponse.json(semSenha);
}

/**
 * PUT /
 * - criar sala (body: { nome })
 */
export async function PUT(request: Request) {
  const { nome } = await request.json();

  if (!nome || !String(nome).trim()) {
    return NextResponse.json({ message: "Nome da sala é obrigatório" }, { status: 400 });
  }

  if (salas.some((s) => s.nome === nome.trim())) {
    return NextResponse.json({ message: "Sala já existe" }, { status: 400 });
  }

  const novaSala: Sala = { id: ++ultimoIdSala, nome: nome.trim() };
  salas.push(novaSala);

  return NextResponse.json(novaSala);
}

/**
 * PATCH /
 * - colocar aluno na sala (body: { alunoId, salaId })
 * - regra: se aluno.turma !== null e diferente de salaId => retornar erro (aluno já está em outra sala)
 * - se aluno.turma === salaId => retorna mensagem informando já está na sala
 */
export async function PATCH(request: Request) {
  const { alunoId, salaId } = await request.json();

  if (typeof alunoId !== "number" || typeof salaId !== "number") {
    return NextResponse.json({ message: "alunoId e salaId obrigatórios" }, { status: 400 });
  }

  const aluno = alunos.find((a) => a.id === alunoId);
  if (!aluno) return NextResponse.json({ message: "Aluno não encontrado" }, { status: 404 });

  const sala = salas.find((s) => s.id === salaId);
  if (!sala) return NextResponse.json({ message: "Sala não encontrada" }, { status: 404 });

  if (aluno.turma === salaId) {
    return NextResponse.json({ message: "Aluno já está nesta sala" });
  }

  if (aluno.turma !== null && aluno.turma !== salaId) {
    return NextResponse.json(
      { message: "Aluno já pertence a outra sala. Remova-o dessa sala antes de adicioná-lo." },
      { status: 400 }
    );
  }

  aluno.turma = salaId;
  const { senha: _, ...semSenha } = aluno;
  return NextResponse.json({ message: "Aluno adicionado à sala", aluno: semSenha });
}

/**
 * DELETE /
 * - ?alunoId=ID  -> remove aluno da sala (set turma = null)
 * - ?salaId=ID   -> excluir sala (apenas se vazia)
 *
 * OBS: se ambos informados, prioriza remoção de aluno.
 */
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const alunoIdParam = searchParams.get("alunoId");
  const salaIdParam = searchParams.get("salaId");

  if (alunoIdParam) {
    const alunoId = Number(alunoIdParam);
    const aluno = alunos.find((a) => a.id === alunoId);
    if (!aluno) return NextResponse.json({ message: "Aluno não encontrado" }, { status: 404 });

    aluno.turma = null;
    return NextResponse.json({ message: "Aluno removido da sala", alunoId });
  }

  if (salaIdParam) {
    const salaId = Number(salaIdParam);
    const sala = salas.find((s) => s.id === salaId);
    if (!sala) return NextResponse.json({ message: "Sala não encontrada" }, { status: 404 });

    const temAluno = alunos.some((a) => a.turma === salaId);
    if (temAluno) {
      return NextResponse.json({ message: "Sala não pode ser excluída, possui alunos." }, { status: 400 });
    }

    salas = salas.filter((s) => s.id !== salaId);
    return NextResponse.json({ message: "Sala excluída", salaId });
  }

  return NextResponse.json({ message: "Parâmetros inválidos" }, { status: 400 });
}
