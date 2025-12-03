"use client";

import { useState } from "react";
import NavbarAluno from "../components/NavbarAluno";
import Footer from "../components/Footer";
import DangerBtn from "../components/DangerBtn";
import useDinheiro from "../hooks/useDinheiro";

export default function QuizzAtividade4() {
  const { dinheiro, setDinheiro } = useDinheiro();

  // Perguntas da Atividade 4
  const questions = [
    {
      question:
        "Segundo a tabela, o que você conseguiria trocando 1 concha rara?",
      options: [
        "1 saco de sal",
        "2 sacos de farinha",
        "3 ferramentas de madeira",
        "5 punhados de grãos",
      ],
      correct: 1,
    },
    {
      question: "O que você pode receber por 1 pele de animal?",
      options: [
        "1 pote de cerâmica",
        "2 potes de cerâmica",
        "3 potes de cerâmica",
        "4 potes de cerâmica",
      ],
      correct: 2,
    },
    {
      question:
        "Quantos cestos de frutas valem 1 machadinho simples?",
      options: ["1", "2", "3", "4"],
      correct: 3,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  // mensagem de acerto/erro
  const [feedback, setFeedback] = useState("");

  // registrar respostas para o resumo final
  const [answers, setAnswers] = useState<
    { question: string; chosen: number; correct: number }[]
  >([]);

  const handleAnswer = () => {
    if (selected === null) return;

    const isCorrect = selected === questions[current].correct;

    // registrar resposta
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

      setFeedback(
        `🎉 Resposta correta! Você ganhou +100! Agora você tem R$ ${(dinheiro + 100).toLocaleString(
          "pt-BR"
        )}`
      );

      // adiciona dinheiro
      setDinheiro(dinheiro + 100);
    } else {
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
          Atividade 4 — Tabela de Trocas
        </h1>

        {!finished && (
          <>
            <p className="text-lg leading-relaxed mb-8 text-justify">
              Nesta atividade, você vai usar uma tabela de equivalências de
              escambo. Cada item abaixo podia ser trocado por outro de valor
              equivalente. Observe bem as trocas e responda às perguntas:
            </p>

            <div className="w-full bg-white p-4 rounded-2xl shadow mb-6 text-left">
              <h2 className="font-bold text-xl mb-2">📜 Tabela de Trocas</h2>

              <ul className="text-lg">
                <li>• 1 concha rara = 2 sacos de farinha</li>
                <li>• 1 pele de animal = 3 potes de cerâmica</li>
                <li>• 1 machadinho simples = 4 cestos de frutas</li>
                <li>• 1 saco de sal = 2 ferramentas de madeira</li>
                <li>• 1 tecido grosso = 5 punhados de grãos</li>
              </ul>
            </div>

            <div className="w-full bg-white shadow-md rounded-2xl p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Pergunta {current + 1}
              </h2>
              <p className="text-lg mb-4">{questions[current].question}</p>

              <div className="flex flex-col gap-3">
                {questions[current].options.map((opt, index) => (
                  <button
                    key={index}
                    onClick={() => setSelected(index)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selected === index
                        ? "bg-purple-300 border-purple-500"
                        : "bg-gray-100 border-gray-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {feedback && (
                <p className="mt-4 text-lg font-semibold">{feedback}</p>
              )}

              <div className="mt-6 flex justify-center">
                <DangerBtn onClick={handleAnswer}>Confirmar</DangerBtn>
              </div>
            </div>
          </>
        )}

        {finished && (
          <div className="flex flex-col items-center bg-white shadow-lg p-8 rounded-2xl w-full">
            <h2 className="text-3xl font-bold mb-4 text-green-600">
              Parabéns!
            </h2>

            <p className="text-lg mb-4">
              Você completou a atividade sobre tabela de trocas.
            </p>

            <p className="text-xl font-semibold mb-4">
              Você acertou {score} de {questions.length} perguntas.
            </p>

            <p className="text-xl font-bold text-purple-600 mb-6">
              Total ganho nesta atividade: +{score * 100} moedas
            </p>

            {/* RESUMO FINAL */}
            <div className="w-full bg-gray-100 p-6 rounded-2xl text-left mb-6">
              <h3 className="text-2xl font-bold mb-4">
                Resumo das respostas:
              </h3>

              {answers.map((ans, index) => {
                const q = questions[index];
                const isRight = ans.chosen === ans.correct;

                return (
                  <div
                    key={index}
                    className="mb-4 p-4 bg-white rounded-xl shadow"
                  >
                    <p className="font-semibold mb-2">
                      Pergunta {index + 1}:
                    </p>
                    <p className="mb-2">{q.question}</p>

                    {isRight ? (
                      <p className="text-green-600 font-bold">
                        ✔ Você acertou!
                      </p>
                    ) : (
                      <>
                        <p className="text-red-600 font-bold">
                          ❌ Você errou
                        </p>
                        <p className="mt-2">
                          ✅ Resposta correta:{" "}
                          <span className="font-semibold">
                            {q.options[q.correct]}
                          </span>
                        </p>
                        <p>
                          ❌ Sua resposta:{" "}
                          <span className="font-semibold">
                            {q.options[ans.chosen]}
                          </span>
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
