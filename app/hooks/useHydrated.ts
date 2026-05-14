import { useSyncExternalStore } from "react";

// 💡 Este es el truco:
// El servidor siempre verá 'false', el cliente siempre verá 'true'.
// useSyncExternalStore maneja la transición sin los problemas de useEffect.
const subscribe = () => () => {}; // No necesitamos suscribirnos a nada real

export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true, // Valor en el Cliente
    () => false, // Valor en el Servidor
  );
}
