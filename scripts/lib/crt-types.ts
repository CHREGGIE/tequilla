export const CRT_URL =
  "https://www.crt.org.mx/empresas-y-marcas-certificadas/";

export interface CrtRecord {
  empresa: string;
  address: string;
  noma: string;
  dot: string;
  marca: string;
  region: string | null;
}

export function parseRegionFromAddress(address: string): string | null {
  const match = address.match(/\.\s*([A-ZÁÉÍÓÚÑ\s]+),\s*([A-ZÁÉÍÓÚÑ]+)\s*Tel:/i);
  if (match) {
    return `${match[1].trim()}, ${match[2].trim()}`;
  }
  const stateMatch = address.match(
    /,\s*(JALISCO|NAYARIT|GUANAJUATO|MICHOACÁN|MICHOACAN|TAMAULIPAS|AGUASCALIENTES|MEXICO|ESTADO DE MÉXICO)\s/i,
  );
  return stateMatch ? stateMatch[1] : null;
}

export function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
