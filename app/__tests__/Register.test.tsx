import { BrowserRouter } from "react-router";

import { jest } from "@jest/globals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import api from "../config/api";
import Register from "../routes/register";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
});

test("debe registrarse correctamente", async () => {
  const apiSpy = jest.spyOn(api, "post").mockResolvedValue({
    data: { message: "Usuario creado exitosamente" },
    status: 201,
  });

  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    </QueryClientProvider>,
  );

  // Llenar campos
  fireEvent.change(screen.getByLabelText(/Nombre/i), {
    target: { value: "Kevin Rodriguez" },
  });
  fireEvent.change(screen.getByLabelText(/Correo/i), {
    target: { value: "kevin@itp.edu.co" },
  });
  fireEvent.change(screen.getByLabelText(/^Contraseña$/i), {
    target: { value: "Password123!" },
  });
  fireEvent.change(screen.getByLabelText(/Confirmar Contraseña/i), {
    target: { value: "Password123!" },
  });

  // Click
  fireEvent.click(screen.getByRole("button", { name: /Crear Cuenta/i }));

  await waitFor(() => {
    // Verificamos que se llamó a la "puerta" correcta con los datos correctos
    expect(apiSpy).toHaveBeenCalledWith(
      "/auth/register",
      expect.objectContaining({
        email: "kevin@itp.edu.co",
      }),
    );
  });

  apiSpy.mockRestore();
});
