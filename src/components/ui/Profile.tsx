"use client";

import { useAuth } from "@/app/providers/AuthContext";
import { useEffect, useState } from "react";

const ProfileLayout = ({
  email,
  onClick,
  disabled,
}: {
  email: string;
  onClick: () => void;
  disabled: boolean;
}) => {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Perfil
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Email: {email}</p>
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Deletar Conta
          </button>
        </div>
      </div>
    </div>
  );
};

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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!isAuthenticated) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="flex justify-center items-center mt-12">
      {user && (
        <ProfileLayout
          email={user.email}
          onClick={handleDeleteAccount}
          disabled={deleting}
        />
      )}
    </div>
  );
}
