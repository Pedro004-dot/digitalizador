// import prisma from "../../models/prismaClient";

// interface CreateLogInput {
//   acao: string;
//   usuarioId: string;
//   documento?: string; // Documento relacionado à ação (opcional)
// }

// const createLog = async (data: CreateLogInput) => {
//   const { acao, usuarioId, documento } = data;

//   return await prisma.log.create({
//     data: {
//       acao,
//       usuarioId,
//       documento,
//       dataHora: new Date(), // Gravação explícita da data/hora
//     },
//   });
// };

// export default { createLog };