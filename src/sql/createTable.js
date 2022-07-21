import {mariaDB} from '../options/mariaDB.js';

const createTable = async (mariaDB) => {
    try {
        await mariaDB.schema.createTable('productos', table =>{
            table.increments('id').primary();
            table.string('nombre');
            table.integer('precio');
        });
    }
    catch(e) {
        console.log(e)
    }
    finally{
        mariaDB.destroy()
    };
    console.log('tabla ok')
};

createTable(mariaDB);