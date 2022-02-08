export interface Message {
  from: string;
  subject: string;
  problem?: Problem;
}

export interface Problem {
  title: string | null;
  difficulty?: string | null;
  pathname?: string;
  due?: number;
  ease?: number;
  interval?: number;
  notes?: string;
}
