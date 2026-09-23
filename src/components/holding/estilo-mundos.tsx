import type { Cliente } from "@/content/clientes";
import { cssDosMundos } from "@/lib/mundos-css";

/** Os tokens de cada mundo, gerados da configuração do cliente resolvido. */
export function EstiloDosMundos({ cliente }: { cliente: Cliente }) {
  return <style dangerouslySetInnerHTML={{ __html: cssDosMundos(cliente) }} />;
}
