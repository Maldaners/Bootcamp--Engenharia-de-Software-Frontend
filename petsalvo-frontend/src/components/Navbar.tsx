"use client";

import { useAuth } from "@/contexts/AuthContext";
import { TipoUsuarioEnum } from "@/contexts/TipoUsuarioEnum";
import { getImagemUsuario, getNome, getTipoUsuario } from "@/contexts/UserContext";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Notificacao from "./Notificacao";

export default function Navbar() {
  const [isOpen, toggleOpen] = React.useState(false);
  const { signOut } = useAuth();
  const [tipoUsuario, setTipoUsuario] = useState<TipoUsuarioEnum | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [imagemUsuario, setImagemUsuario] = useState<string | null>();

  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setTipoUsuario(getTipoUsuario());
    setNome(getNome());
    setImagemUsuario(getImagemUsuario());
  }, []);

  const toggleMenu = () => {
    toggleOpen((open) => !open);
  };

  const handleLogout = () => {
    signOut();
    setTipoUsuario(null);
    setNome(null);
    setImagemUsuario(null);
    toggleMenu();
    if (pathname === "/") {
      window.location.reload();
    } else {
      push('/');
    }
  };

  return (
    <nav className="mainNav bg-main">
      {/*Logo*/}
      <div className="flex flex-wrap items-center justify-between mx-auto p-6">
        <span className="hover:cursor-pointer" onClick={() => push("/")}>
          <Image src="/Logo.svg" width={150} height={50} alt="logo" />
        </span>

        {/*Foto*/}
        <div className="flex items-center md:order-2 relative">
          <div className="mr-4 text-white">
            {tipoUsuario ? "" : "Visitante"} {nome ? nome : ""}
          </div>
          {tipoUsuario && <Notificacao />}
          <button
            onClick={toggleMenu}
            type="button"
            className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 hover:ring-4 hover:ring-white-600 focus:ring-4 border-2 focus:ring-gray-600 dark:focus:ring-white-600"
            id="user-menu-button"
            aria-expanded="false"
            data-dropdown-toggle="user-dropdown"
            data-dropdown-placement="bottom"
          >
            <span className="sr-only">Open user menu</span>
            <div className="relative h-12 w-12">
              <Image
                className="rounded-full"
                src={imagemUsuario ? imagemUsuario : "/User.svg"}
                alt="user photo"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </button>

          {/*Fecha o menu ao clicar fora*/}
          {isOpen ? (
            <button
              tabIndex={-1}
              className="fixed inset-0 cursor-default"
              onClick={() => toggleOpen(false)}
            ></button>
          ) : (
            ""
          )}

          {/*Menu dropdown da foto*/}
          {isOpen ? (
            <div
              className="w-48 top-16 bg-white rounded-sm shadow-xl absolute right-0 text-center border border-solid border-gray-900 "
              id="user-dropdown"
            >
              <ul
                className="py-2 divide-y divide-slate-700"
                aria-labelledby="user-menu-button"
              >
                {tipoUsuario ? (
                  <li>
                    <a
                      className="block px-4 py-4 hover:bg-teal-400 hover:text-white cursor-pointer"
                      onClick={() => push("/perfil")}
                    >
                      Perfil
                    </a>
                  </li>
                ) : (
                  ""
                )}
                {tipoUsuario ? (
                  <li>
                    <a
                      className="block px-4 py-4 hover:bg-teal-400 hover:text-white cursor-pointer"
                      onClick={handleLogout}
                    >
                      Sair
                    </a>
                  </li>
                ) : (
                  ""
                )}
                {tipoUsuario === null ? (
                  <li>
                    <a
                      className="block px-4 py-4 hover:bg-teal-400 hover:text-white cursor-pointer"
                      onClick={() => push("/login")}
                    >
                      Login
                    </a>
                  </li>
                ) : (
                  ""
                )}
              </ul>
            </div>
          ) : (
            ""
          )}

          {/*Menu sanduiche mobile*/}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 
            rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        {/*Itens do Menu*/}
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          <ul
            className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0"
            style={{ backgroundColor: "#2ec4b6" }}
          >
            <li>
              <a
                className={
                  pathname == "/"
                    ? "block cursor-pointer text-blue-500 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 "
                    : " block cursor-pointer text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 "
                }
                aria-current="page"
                onClick={() => push("/")}
              >
                Home
              </a>
            </li>
            {tipoUsuario !== TipoUsuarioEnum.ONG ? (
              <li>
                <a
                  className={
                    pathname == "/lista-ongs"
                      ? "block cursor-pointer text-blue-500 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 "
                      : " block cursor-pointer text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 "
                  }
                  onClick={() => push("/lista-ongs")}
                >
                  Ajude uma ONG
                </a>
              </li>
            ) : (
              ""
            )}
            {tipoUsuario === TipoUsuarioEnum.ONG ? (
              <>
                <li>
                  <a
                    className={
                      pathname == "/adoption-requests"
                        ? "block cursor-pointer text-blue-500 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 "
                        : " block cursor-pointer text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 "
                    }
                    onClick={() => push("/adoption-requests")}
                  >
                    Solicitações de adoção
                  </a>
                </li>
                <li>
                  <a
                    className={
                      pathname == "/pet"
                        ? "block cursor-pointer text-blue-500 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 "
                        : " block cursor-pointer text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 "
                    }
                    onClick={() => push("/pet")}
                  >
                    Cadastrar pet
                  </a>
                </li>
              </>
            ) : tipoUsuario === TipoUsuarioEnum.ADOTANTE ? (
              <li>
                <a
                  className={
                    pathname == "/my-matches"
                      ? "block cursor-pointer text-blue-500 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-blue-500 md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 "
                      : " block cursor-pointer text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 "
                  }
                  onClick={() => push("/my-matches")}
                >
                  Meus matches
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
}
