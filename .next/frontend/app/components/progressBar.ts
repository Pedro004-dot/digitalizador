// import { motion } from "framer-motion";
// import React from "react";

// interface ProgressBarProps {
//   progress: number; // Certifique-se de que progress é um número
// }

// const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
//   // Função corrigida para determinar a cor com validação explícita
//   const getColor = (value: number): string => {
//     if (value < 50) return "green";
//     if (value < 80) return "yellow";
//     return "red";
//   };

//   return (
//     <div className="w-full h-8 bg-gray-200 rounded-lg relative overflow-hidden">
//       {/* Framer Motion Animated Bar */}
//       <motion.div
//         className="h-full rounded-lg"
//         initial={{ width: "0%" }}
//         animate={{ width: `${progress}%` }} // Garantimos que progress é um número
//         transition={{ duration: 0.5 }}
//         style={{ backgroundColor: getColor(progress) }}
//       />
//       {/* Texto de progresso */}
//       <span className="absolute top-1/2 left-2 transform -translate-y-1/2 text-sm text-gray-800">
//         {progress}% concluído
//       </span>
//     </div>
//   );
// };

// export default ProgressBar;