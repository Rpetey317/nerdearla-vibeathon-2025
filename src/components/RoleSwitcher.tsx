"use client";

import { useRole } from "@/context/role-context";

export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Rol:</span>
      <select
        className="block w-40 pl-3 pr-10 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
        value={role}
        onChange={(e) => setRole(e.target.value as any)}
      >
        <option value="student">Alumno</option>
        <option value="teacher">Profesor</option>
        <option value="coordinator">Coordinador</option>
      </select>
    </div>
  );
}
