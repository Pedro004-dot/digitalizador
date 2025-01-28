declare namespace Express{
  export interface Request{
    user?: {
      id: string;
      cpf: string;
      prefeituraId: string;
      nome: string;
      permissoes: string;
      prefeitura: {
        cidade: string;
        createdAt: Date;
      };
    };
  }
}