"use client";

import { useState } from "react";
import { Application } from "@/generated/prisma/client";

export function NewApplicationForm({
  onCreated,
}: {
  onCreated: (application: Application) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [url, setUrl] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, url: url || null }),
    });
    const application = await response.json();

    onCreated(application);
    setCompany("");
    setRole("");
    setUrl("");
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mb-4 rounded-md bg-gray-900 px-4 py-2 text-white"
      >
        + Nova candidatura
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-wrap gap-2 rounded-md bg-gray-100 p-4"
    >
      <input
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        placeholder="Empresa"
        required
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
      />
      <input
        value={role}
        onChange={(event) => setRole(event.target.value)}
        placeholder="Vaga"
        required
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
      />
      <input
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="Link (opcional)"
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
      />
      <button
        type="submit"
        className="rounded-md bg-gray-900 px-4 py-2 text-white"
      >
        Adicionar
      </button>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="rounded-md px-4 py-2 text-gray-500"
      >
        Cancelar
      </button>
    </form>
  );
}
