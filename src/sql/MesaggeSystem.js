import knexLib from 'knex'

class MesaggeSystem{
    constructor(config) {
      this.knex = knexLib(config)
    };

    crearTabla() {
        return this.knex.schema.dropTableIfExists('mensajes')
          .finally(() => {
            return this.knex.schema.createTable('mensajes', table => {
              table.increments('id').primary();
              table.string('email', 50).notNullable();
              table.string('texto', 250).notNullable();
              table.string('timestamp', 50).notNullable();
            })
        })
    };

    insertarMensaje(mensaje) {
        return this.knex('mensajes').insert(mensaje)
    };

    listarMensajes() {
        return this.knex('mensajes').select('*')
    }
}

export {MesaggeSystem}