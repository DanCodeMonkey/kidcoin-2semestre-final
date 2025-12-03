"use client";

import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import ModalWelcome from "../components/ModalWelcome";
import NavbarAluno from "../components/NavbarAluno";
import DangerBtn from "../components/DangerBtn";
import ModalCenty from "../components/ModalCenty";
import { useRouter } from "next/navigation";

interface CellContent {
  id: number;
  content?: React.ReactNode;
  activity?: string; // rota da atividade
}

const STORAGE_KEY = "mapa.welcomeShown";

export default function Mapa() {
  const router = useRouter();

  const [showWelcome, setShowWelcome] = useState(false);
  const [showCenty, setShowCenty] = useState(false);

  useEffect(() => {
    try {
      const alreadyShown = localStorage.getItem(STORAGE_KEY);
      if (!alreadyShown) {
        setShowWelcome(true);
      }
    } catch (err) {
      console.warn("Erro acessando localStorage:", err);
    }
  }, []);

  const handleCloseWelcome = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (err) {
      console.warn("Erro ao salvar localStorage:", err);
    }
    setShowWelcome(false);
  };

  // GRID DO MAPA
  const gridData: CellContent[] = Array.from({ length: 20 }, (_, i) => {
    let cell: CellContent = { id: i };

    // Atividade 01
    if (i === 0) {
      cell.content = (
        <img
          src="assets/Atividade-01.png"
          className="h-50 cursor-pointer transition-transform hover:scale-110"
        />
      );
      cell.activity = "/atividade-01";
    }

    // Atividade 02
    if (i === 4) {
      cell.content = (
        <img
          src="assets/Atividade-02.png"
          className="h-50 cursor-pointer transition-transform hover:scale-110"
        />
      );
      cell.activity = "/atividade-02";
    }

    // Atividade 03
    if (i === 7) {
      cell.content = (
        <img
          src="assets/Atividade-03.png"
          className="h-50 cursor-pointer transition-transform hover:scale-110"
        />
      );
      cell.activity = "/atividade-03";
    }

    // Atividade 04
    if (i === 15) {
      cell.content = (
        <img
          src="assets/Atividade-04.png"
          className="h-50 cursor-pointer transition-transform hover:scale-110"
        />
      );
      cell.activity = "/atividade-04";
    }

    // Caminhos tracejados
    if (i === 1 || i === 2 || i === 3 || i === 6 || i === 8) {
      cell.content = (
        <div className="border-b-2 border-dashed border-gray-800 w-4/5"></div>
      );
    }

    if (i === 10) {
      cell.content = (
        <div className="border-r-2 border-dashed border-gray-800 h-4/5"></div>
      );
    }

    if (i === 9) {
      cell.content = (
        <div className="flex flex-wrap w-full h-full">
          <div className="border-r-2 border-b-2 border-dashed w-2/4 h-1/2 border-gray-800"></div>
          <div className="w-1/2 h-1/2"></div>
          <div className="w-1/2 h-1/2"></div>
          <div className="w-1/2 h-1/2"></div>
        </div>
      );
    }

    if (i === 5) {
      cell.content = (
        <div className="flex flex-wrap w-full h-full">
          <div className="w-1/2 h-1/2"></div>
          <div className="w-1/2 h-1/2"></div>
          <div className="w-1/2 h-1/2"></div>
          <div className="border-l-2 border-t-2 border-dashed w-1/2 h-1/2"></div>
        </div>
      );
    }

    return cell;
  });

  // CLICK NO MAPA
  const handleClick = (cell: CellContent) => {
    if (cell.activity) {
      router.push(cell.activity);
      return;
    }

    console.log(`Clicou na célula ${cell.id}`);
  };

  return (
    <>
      <NavbarAluno />

      <div className="flex flex-row items-center justify-center img-animation py-8">
        <img src="assets/heroasset.png" alt="" className="h-30" />
        <h2 className="text-4xl text-(--primary-font-color) font-bold p-6">
          Bem vindo à sua primeira aventura
        </h2>
      </div>

      <div className="flex justify-center items-center">
        <DangerBtn onClick={() => setShowWelcome(true)}>Vamos lá!</DangerBtn>
      </div>

      {/* MAPA COM BACKGROUND */}
      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
        style={{
  backgroundImage: "url('assets/map-bg.png')",
  backgroundSize: "contain",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
}}
      >
        <div className="p-6 rounded-2xl">
          <div className="grid grid-cols-5 grid-rows-4">
            {gridData.map((cell) => (
              <button
                key={cell.id}
                onClick={() => handleClick(cell)}
                className="flex items-center justify-center h-50 w-60 rounded-lg overflow-visible"
              >
                {cell.content}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modal bem-vindo */}
      {showWelcome && <ModalWelcome onClose={handleCloseWelcome} />}

      {/* Modal centy */}
      {showCenty && <ModalCenty onClose={() => setShowCenty(false)} />}

      <Footer />
    </>
  );
}
