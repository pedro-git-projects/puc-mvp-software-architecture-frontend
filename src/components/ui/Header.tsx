"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { NAVIGATION } from "@/lib/consts";
import { useRouter } from "next/navigation";
import logo from "@/images/logo_alt.svg";
import Image from "next/image";
import { useAuth } from "@/app/providers/AuthContext";

interface HeaderProps {
  isAuthenticated: boolean;
}

export default function Header({ isAuthenticated }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { logout } = useAuth();

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      router.push(`/search?query=${query}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-x-6 p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex items-center lg:flex-1 gap-x-12">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Songboxd</span>
            <Image className="h-12 w-auto" src={logo} alt="Songboxd" />
          </Link>
          <div className="hidden lg:flex lg:gap-x-12">
            {isAuthenticated &&
              NAVIGATION.map(item =>
                item.name === "Home" ? null : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-sm font-semibold leading-6 text-gray-900"
                  >
                    {item.name}
                  </Link>
                ),
              )}
          </div>
        </div>
        {isAuthenticated && (
          <div className="hidden lg:flex flex-1 items-center justify-center gap-x-6">
            <input
              type="text"
              placeholder="Buscar álbuns, músicas ou artistas..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleSearch}
              className="border rounded p-2 w-full max-w-xs"
            />
          </div>
        )}
        <div className="flex items-center gap-x-6">
          {!isAuthenticated ? (
            <>
              <Link
                href="/signin"
                className="hidden lg:block lg:text-sm lg:font-semibold lg:leading-6 lg:text-gray-900"
              >
                Entrar
              </Link>
              <a
                href="/signup"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Cadastrar-se
              </a>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sair
            </button>
          )}
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>
      <Dialog
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center gap-x-6">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Music Explorer</span>
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                alt="Music Explorer"
              />
            </a>
            {!isAuthenticated ? (
              <>
                <Link
                  href="/signup"
                  className="ml-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Cadastrar-se
                </Link>
                <Link
                  href="/signin"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Entrar
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="ml-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sair
              </button>
            )}
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          {isAuthenticated && (
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {NAVIGATION.map(item => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <input
                    type="text"
                    placeholder="Buscar álbuns, músicas ou artistas..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="border rounded p-2 w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </DialogPanel>
      </Dialog>
    </header>
  );
}
