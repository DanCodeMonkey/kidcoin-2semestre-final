"use client";

import { useState } from "react";
import NavbarAluno from "../components/NavbarAluno";
import Footer from "../components/Footer";
import DangerBtn from "../components/DangerBtn";
import useDinheiro from "../hooks/useDinheiro";

export default function QuizzAtividade2() {
  const { dinheiro, setDinheiro } = useDinheiro();

  // Perguntas da atividade 2
  const questions = [
    {
      question:
        "Por que alguns produtos valiam mais que outros?",
      options: [
        "Porque eram feios.",
        "Porque eram difíceis de conseguir e muito úteis.",
        "Porque ninguém queria trocar.",
        "Porque eram feitos de ouro.",
      ],
      correct: 1,
    },
    {
      question:
        "Por que o sal era tão valioso naquela época?",
      options: [
        "Porque servia apenas para colorir.",
        "Porque conservava alimentos.",
        "Porque era uma pedra comum.",
        "Porque era usado como brinquedo.",
      ],
      correct: 1,
    },
    {
      question:
        "O que fazia certas ferramentas ou armas serem valiosas na troca?",
      options: [
        "Eram usadas só para enfeitar.",
        "Ajudavam no trabalho e na caça.",
        "Sempre quebravam.",
        "Não tinham utilidade.",
      ],
      correct: 1,
    },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);

  const [feedback, setFeedback] = useState("");

  // Registrar respostas do aluno
  const [answers, setAnswers] = useState<
    { question: string; chosen: number; correct: number }[]
  >([]);

  const handleAnswer = () => {
    if (selected === null) return;

    const isCorrect = selected === questions[current].correct;

    // Armazena resposta
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
        )}.`
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
      // Finaliza quizz
      setTimeout(() => {
        setFinished(true);
      }, 1000);
    }
  };

  return (
    <>
      <NavbarAluno />

      <div className="flex flex-col items-center text-center p-6 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-(--primary-font-color)">
          Atividade 2 — Produtos Valiosos no Escambo
        </h1>

        {!finished && (
          <>
            <p className="text-lg leading-relaxed mb-8 text-justify">
              Na época do escambo, alguns produtos eram considerados muito valiosos porque eram difíceis de
              conseguir e muito úteis no dia a dia. Alimentos como grãos, frutas secas e carne salgada eram
              essenciais. Ferramentas e armas ajudavam no trabalho e na caça. Peles e tecidos serviam para
              roupas e proteção. E o sal era um dos itens mais preciosos, pois conservava os alimentos.
              Quanto mais útil o produto, maior o seu valor na troca.
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
            <h2 className="text-3xl font-bold mb-4 text-green-600">Parabéns!</h2>

            <p className="text-lg mb-4">Você completou a atividade sobre produtos valiosos no escambo.</p>

            <p className="text-xl font-semibold mb-4">
              Você acertou {score} de {questions.length} perguntas.
            </p>

            <p className="text-xl font-bold text-purple-600 mb-6">
              Total ganho nesta atividade: +{score * 100} moedas
            </p>

            {/* Resumo das respostas */}
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

            <DangerBtn
              onClick={() => (window.location.href = "/mapa")}
            >
              Voltar ao mapa
            </DangerBtn>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
