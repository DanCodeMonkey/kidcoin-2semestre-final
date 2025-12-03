"use client";

import { useState } from "react";
import NavbarAluno from "../components/NavbarAluno";
import Footer from "../components/Footer";
import DangerBtn from "../components/DangerBtn";
import useDinheiro from "../hooks/useDinheiro";

export default function QuizzAtividade1() {
  const { dinheiro, setDinheiro } = useDinheiro();

  // Perguntas do quizz
  const questions = [
    {
      question:
        "O texto explica que, antes do dinheiro existir, as pessoas usavam o escambo. O que isso significa?",
      options: [
        "Que todos recebiam moedas de ouro.",
        "Que as pessoas trocavam objetos ou serviços diretamente.",
        "Que ninguém precisava de nada.",
        "Que trocas eram proibidas.",
      ],
      correct: 1,
    },
    {
      question:
        "Para o escambo funcionar, o que precisava acontecer?",
      options: [
        "Só uma pessoa precisava gostar da troca.",
        "As duas pessoas tinham que achar a troca justa.",
        "As trocas eram obrigatórias.",
        "A troca era decidida pelo chefe da vila.",
      ],
      correct: 1,
    },
    {
      question:
        "Você tenta trocar mel por uma ferramenta, mas o artesão não quer mel hoje! O que isso mostra sobre o escambo?",
      options: [
        "Que era sempre rápido.",
        "Que às vezes o que você tinha não interessava ao outro.",
        "Que ninguém escolhia o que queria.",
        "Que todos queriam as mesmas coisas.",
      ],
      correct: 1,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  // mensagem de acerto/erro
  const [feedback, setFeedback] = useState("");

  // NOVO: registrar respostas do aluno
  const [answers, setAnswers] = useState<
    { question: string; chosen: number; correct: number }[]
  >([]);

  const handleAnswer = () => {
    if (selected === null) return;

    const isCorrect = selected === questions[current].correct;

    // grava a resposta do usuário
    setAnswers((prev) => [
      ...prev,
      {
        question: questions[current].question,
        chosen: selected,
        correct: questions[current].correct,
      },
    ]);

    if (isCorrect) {
      setScore((prev) => prev + 1);

      // feedback positivo
      setFeedback(
        `🎉 Resposta correta! Você ganhou +100! Agora você tem R$ ${(dinheiro + 100).toLocaleString(
          "pt-BR"
        )}`
      );

      // adiciona 100 DINHEIROS
      setDinheiro(dinheiro + 100);
    } else {
      // feedback negativo
      setFeedback("❌ Resposta incorreta!");
    }

    // próxima pergunta
    if (current + 1 < questions.length) {
      setTimeout(() => {
        setCurrent((prev) => prev + 1);
        setSelected(null);
        setFeedback("");
      }, 1400);
    } else {
      setTimeout(() => {
        setFinished(true);
      }, 1200);
    }
  };

  return (
    <>
      <NavbarAluno />

      <div className="flex flex-col items-center text-center p-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-(--primary-font-color)">
          Atividade 1 — A Aventura do Escambo
        </h1>

        {!finished && (
          <>
            <p className="text-lg leading-relaxed mb-8 text-justify">
              Você sabia que antigamente não existia dinheiro? Tudo era a base de trocas — esse sistema era
              chamado de escambo. As pessoas trocavam objetos ou serviços entre si. Para a troca funcionar,
              os dois lados tinham que achar justo. O escambo foi muito importante para as primeiras
              sociedades, mas nem sempre era fácil, pois era preciso encontrar alguém que quisesse exatamente
              o que você tinha.
            </p>

            <div className="w-full bg-white shadow-md rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Pergunta {current + 1}</h2>
              <p className="text-lg mb-4">{questions[current].question}</p>

              <div className="flex flex-col gap-3">
                {questions[current].options.map((opt, index) => (
                  <button
                    key={index}
                    onClick={() => setSelected(index)}
                    className={`p-3 rounded-xl border text-left transition-all
                      ${
                        selected === index
                          ? "bg-purple-300 border-purple-500"
                          : "bg-gray-100 border-gray-300"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {feedback && <p className="mt-4 text-lg font-semibold">{feedback}</p>}

              <div className="mt-6 flex justify-center">
                <DangerBtn onClick={handleAnswer}>Confirmar</DangerBtn>
              </div>
            </div>
          </>
        )}

        {finished && (
          <div className="flex flex-col items-center bg-white shadow-lg p-8 rounded-2xl w-full">
            <h2 className="text-3xl font-bold mb-4 text-green-600">Parabéns!</h2>

            <p className="text-lg mb-4">Você completou a atividade sobre o escambo.</p>

            <p className="text-xl font-semibold mb-4">
              Você acertou {score} de {questions.length} perguntas.
            </p>

            <p className="text-xl font-bold text-purple-600 mb-6">
              Total ganho nesta atividade: +{score * 100} moedas
            </p>

            {/* NOVO — RESUMO FINAL */}
            <div className="w-full bg-gray-100 p-6 rounded-2xl text-left">
              <h3 className="text-2xl font-bold mb-4">Resumo das respostas:</h3>

              {answers.map((ans, index) => {
                const q = questions[index];
                const isRight = ans.chosen === ans.correct;

                return (
                  <div key={index} className="mb-4 p-4 bg-white rounded-xl shadow">
                    <p className="font-semibold mb-2">Pergunta {index + 1}:</p>
                    <p className="mb-2">{q.question}</p>

                    {isRight ? (
                      <p className="text-green-600 font-bold">✔ Você acertou!</p>
                    ) : (
                      <>
                        <p className="text-red-600 font-bold">❌ Você errou</p>
                        <p className="mt-2">
                          ✅ Resposta correta:{" "}
                          <span className="font-semibold">{q.options[q.correct]}</span>
                        </p>
                        <p>
                          ❌ Sua resposta:{" "}
                          <span className="font-semibold">{q.options[ans.chosen]}</span>
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <DangerBtn onClick={() => (window.location.href = "/mapa")}>
              Voltar ao mapa
            </DangerBtn>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
