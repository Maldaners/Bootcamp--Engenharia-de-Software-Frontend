"use client";
import PrimaryButton from "@/components/BotaoPrimario";
import CardPet from "@/components/CardPet";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Pagination from "@/components/Pagination";
import { getIdUsuario, getTipoUsuario } from "@/contexts/UserContext";
import { petService } from "@/services/pet.service";
import { useEffect, useState } from "react";

export default function Home() {
  const [petsList, setPetsList] = useState([]);
  const [petType, setPetType] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToShow = petsList.slice(startIndex, endIndex);

  useEffect(() => {
    petService
      .getAllPets(getTipoUsuario(), getIdUsuario())
      .then((response: any) => {
        if (response.length > 0) {
          if (petType === 1) {
            setPetsList(
              response.filter((pet: { tipo: number }) => pet.tipo === 1)
            );
          } else if (petType === 2) {
            setPetsList(
              response.filter((pet: { tipo: number }) => pet.tipo === 2)
            );
          } else {
            setPetsList(response);
          }
        } else {
          setPetsList([]);
        }
      })
      .catch((error: any) => {
        console.error("Erro ao buscar lista de pets:", error);
      });
  }, [petType]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Navbar />
        <div className="flex flex-col items-center bg-background px-4 py-8 sm:py-14 sm:px-32 md:px-40 xl:px-60 2xl:px-80 gap-12">
          <h1 className="self-start text-2xl md:text-3xl">Procuro por...</h1>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-32 w-2/4">
            <PrimaryButton
              text="Cachorros"
              onClick={() => {
                petType === 1 ? setPetType(null) : setPetType(1);
              }}
              className={petType === 1 ? "!bg-secondary flex-1" : "flex-1"}
            />
            <PrimaryButton
              text="Gatos"
              onClick={() => {
                petType === 2 ? setPetType(null) : setPetType(2);
              }}
              className={petType === 2 ? "!bg-secondary flex-1" : "flex-1"}
            />
          </div>
          {petsList.length > 0 ? (
            <>
              <div className="grid grid-flow-row grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-8 w-full">
                {itemsToShow.map((pet) => {
                  return <CardPet key={pet.idPet} pet={{ pet }} />;
                })}
              </div>
              <div className="paginate">
                <Pagination
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  items={petsList}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="text-center mt-10">
              {" "}
              Não foram encontrados Pets para adoção
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
