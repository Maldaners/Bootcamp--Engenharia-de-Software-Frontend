import ButtonConfirmar from "@/components/BotaoConfirmar";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Footer() {
  const { push } = useRouter();

  return (
    <footer className="flex flex-col items-center gap-4 bg-main w-full p-4 shadow md:flex md:items-center md:justify-between md:p-6">
      <span className="hover:cursor-pointer" onClick={() => push("/")}>
        <Image src="/Logo.svg" width={150} height={50} alt="logo" />
      </span>
      <div className="text-gray-100 flex flex-col items-center gap-4">
        <span>Quero Ajudar uma ONG</span>
        <ButtonConfirmar text="Ajude!" onClick={() => push("/lista-ongs")} />
      </div>
    </footer>
  );
}
