import { Interest } from './interest.model';

export interface ClientData {
  cognome: string;
  nome: string;
  email: string;
  cellulare: string;
  indirizzo: string;
  civico: string;
  citta: string;
  vendita: Interest;
  dimostrazione: Interest;
  note: string;
  id: number;
}
