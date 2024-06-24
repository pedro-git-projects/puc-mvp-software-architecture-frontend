"use client";

import { useAuth } from "@/app/providers/AuthContext";
import { useEffect, useState } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import DeleteAccountModal from "./DeleteAccountModal";

export async function deleteUserAccount() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:8000/users/me", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user account");
  }

  return response.json();
}

export async function fetchUserProfile() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:8000/users/me/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return response.json();
}

export default function Profile() {
  const { isAuthenticated, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const getUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const data = await fetchUserProfile();
          setUser(data);
        } catch (err: any) {
          setError(err.message);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    getUserProfile();
  }, [isAuthenticated, logout]);

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteUserAccount();
      logout();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Carregando...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Por favor faça login para acessar o perfil.
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Seu Perfil
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Gerencie as informações do seu perfil e delete sua conta se desejar.
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none">
          <div className="flex flex-col">
            {user && (
              <>
                <ul role="list" className="max-w-xl space-y-8 text-gray-600">
                  <li className="flex gap-x-3">
                    <CheckCircleIcon
                      className="mt-1 h-5 w-5 flex-none text-indigo-600"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-semibold text-gray-900">
                        Email:
                      </strong>{" "}
                      {user.email}
                    </span>
                  </li>

                  <li
                    className="cursor-pointer flex gap-x-3"
                    onClick={() => setModalOpen(true)}
                  >
                    <XCircleIcon
                      className="mt-1 h-5 w-5 flex-none text-red-600"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="font-semibold text-gray-900">
                        Deletar a Conta.{" "}
                      </strong>
                      Esta ação é irreversível. Ao deletar sua conta, todos os
                      seus dados serão permanentemente removidos e não poderão
                      ser recuperados.
                    </span>
                  </li>
                </ul>
                <DeleteAccountModal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  onConfirm={handleDeleteAccount}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
