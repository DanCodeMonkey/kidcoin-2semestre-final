"use client";

import { useRouter } from "next/navigation";
import PrimaryBtnLG from "./PrimaryBtnLG";

interface ModalWelcomeProps {
  onClose?: () => void;
}

export default function ModalWelcome({ onClose }: ModalWelcomeProps) {
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
          <img src="assets/ola-viajante.png" alt="Saudação" className="mx-auto" />
          <br />
          <span className="text-3xl font-bold text-center block mb-4">
            Seja bem-vindo ao mundo de Kidcoin
          </span>

          <div className="text-2xl my-6">
            <p>
              Aqui, você vai conhecer vilas incríveis, ajudar personagens,
              resolver desafios e aprender como cuidar bem do seu dinheiro!
            </p>
            <br />

            <p>Está pronto para começar sua jornada?</p>

            <br />
            <p className="pb-10">
              Clique na <b>Atividade 1</b> e venha descobrir o que te espera!
            </p>

            <PrimaryBtnLG onClick={toMap}>Começar!</PrimaryBtnLG>
          </div>
        </div>

        <div>
          <img src="assets/heroasset.png" alt="Personagem principal" />
        </div>
      </div>
    </div>
  );
}
