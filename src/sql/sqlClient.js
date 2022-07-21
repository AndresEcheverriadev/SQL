import knexLib from 'knex'

class ClienteSql {
    constructor(config) {
      this.knex = knexLib(config)
    };

    crearTabla() {
        return this.knex.schema.dropTableIfExists('productos')
          .finally(() => {
            return this.knex.schema.createTable('productos', table => {
              table.increments('id').primary();
              table.string('title', 50).notNullable();
              table.string('thumbnail', 250).notNullable();
              table.integer('price');
            })
        })
    };

    insertarProductos(productos) {
        return this.knex('productos').insert(productos)
    };

    listarProductos() {
        return this.knex('productos').select('*')
    }
}

export {ClienteSql}