import sequelizeData from './database';
import { Usuario } from '../models/usuario';
import { Prefeitura } from '../models/prefeitura';
import { Documento } from '../models/documento';
import { Log } from '../models/logs';

// Configurar relacionamentos entre os modelos
Usuario.belongsTo(Prefeitura, { foreignKey: 'prefeituraId', as: 'prefeitura' });
Prefeitura.hasMany(Usuario, { foreignKey: 'prefeituraId', as: 'usuarios' });

Documento.belongsTo(Prefeitura, { foreignKey: 'prefeituraid', as: 'prefeitura' });
Documento.belongsTo(Usuario, { foreignKey: 'usuarioid', as: 'usuario' });
Prefeitura.hasMany(Documento, { foreignKey: 'prefeituraid', as: 'documentos' });
Usuario.hasMany(Documento, { foreignKey: 'usuarioid', as: 'documentos' });

Log.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });

// Sincronizar os modelos com o banco de dados
export async function initializeDatabase() {
  try {
    await sequelizeData.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Sincronizar os modelos
    await sequelizeData.sync({ alter: true }); // alter: true atualiza a estrutura das tabelas
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  }
}

export default sequelizeData;