"use client";

import { useRouter } from "next/navigation";
import PrimaryBtnLG from "./PrimaryBtnLG";

interface ModalWelcomeProps {
  onClose?: () => void;
}

export default function ModalCenty({ onClose }: ModalWelcomeProps) {
  const router = useRouter();

  const toMap = () => {
    if (onClose) onClose(); // fecha o modal antes de navegar
    router.push("/mapa");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-(--cream-kidcoin) p-10 rounded-2xl shadow-xl max-w-6xl w-full flex justify-center items-center flex-row gap-6 relative">
        {/* botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          ×
        </button>

        <div className="w-1/2 text-center">
          <img src="assets/escambo-title.png" alt="Saudação" className="mx-auto" />
          <br />
          <span className="text-2xl font-bold text-center block mb-4">
            Um barquinho balança suavemente nas águas douradas.
          </span>

          <div className="text-lg my-6">
            <p>

              Ao fundo, surge uma pequena vila com bandeirinhas coloridas e feirinhas
              animadas.
            </p>
            <br />

            <p>— Uau... que lugar é esse? — pensa a pessoa explorante.</p>

            <br />
            <p>Centy, o mascote brilhante do KidCoin, aparece flutuando:</p>
            <p>— Bem-vindos ao início da nossa jornada! Aqui, tudo começou com trocas, antes mesmo das moedas existirem.</p>
            <br />
              <p className="pb-5">O vento sopra moedas douradas no ar e Centy completa:

 — Vamos aprender como as pessoas faziam para conseguir o que precisavam,
mesmo sem dinheiro no bolso?</p>



            <PrimaryBtnLG onClick={toMap}>Começar!</PrimaryBtnLG>
          </div>
        </div>

        <div>
          <img src="assets/centy.png" alt="Personagem principal" className="h-100" />
        </div>
      </div>
    </div>
  );
}
