import useDinheiro from "../hooks/useDinheiro";

interface AlunoInfoAtLojinhaProps {
  avatar: string;
  dinheiro: number;
}

export default function AlunoInfoAtLojinha({ avatar }: AlunoInfoAtLojinhaProps) {
   const { dinheiro } = useDinheiro();
  return (
    <section className="my-34 flex flex-col justify-center items-center gap-10 w-1/4 fixed left-0 top-0 p-4">
      <div>
        <h3 className="text-4xl font-bold mb-6 text-center">
          Pedrinho
        </h3>
        <img src={avatar} alt="Avatar atual do aluno" className="img-animation h-70 w-100 object-contain" />
      </div>
      <div>
        <ul className="flex flex-row gap-7 justify-center text-lg">
          <li className="text-center font-bold">
            <span>💰 Dinheirinho</span>
            <br />
            <span className="text-green-700 text-2xl">{dinheiro}</span>
            <span className="text-green-700 text-2xl">$</span>
          </li>
          
        </ul>
      </div>
    </section>
  );
}
