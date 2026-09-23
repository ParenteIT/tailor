import { CLIENTE } from "@/content/clientes";
import { cssDosMundos } from "@/lib/mundos-css";

/** Os tokens de cada mundo, gerados da configuração do cliente. */
export function EstiloDosMundos() {
  return <style dangerouslySetInnerHTML={{ __html: cssDosMundos(CLIENTE) }} />;
}
