let conn = require('./db');
let path = require('path');

module.exports = 
{

    getMenus()
    {

        return new Promise((resolve, reject) =>
        {

            conn.query("SELECT * FROM tb_menus ORDER BY title", (err, results) =>
            {
         
               if (err)
               {
                  reject(err);
               }
               else
               {
                  resolve(results);
               }
         
            });            

        });
    },

    save(fields, files)
    {

        return new Promise((resolve, reject) =>
        {

            console.log('menussave > ', fields);

            // pega somente o nome do arquivo gerado pelo 'formidable
            fields.photo = `images/${path.parse(files.photo.path).base}`;

            let query;
            let queryPhoto = "";
            let params = [fields.title, fields.description, fields.price];

            // se tiver photo enviada, cria o incremento do comando sql
            if (files.photo.name)
            {
                queryPhoto = ",photo = ?";
                params.push(fields.photo);
            }

            // verifica se é inclusão ou atualização
            if (parseInt(fields.id) > 0)
            {

                params.push(fields.id);

                query = `
                    UPDATE 
                        tb_menus
                    SET 
                        title = ?,
                        description = ?,
                        price = ?
                        ${queryPhoto}
                    WHERE 
                        id = ?`;

            }
            else
            {

                if (!files.photo.name)
                {
                    reject("Envie a Foto padrão do produto.");
                }

                query = `
                    INSERT INTO tb_menus
                    (title, description, price, photo)
                    VALUES 
                    (?, ?, ?, ?)`;

            }

            conn.query(query, params, (err, results) =>
            {
         
                if (err)
                {
                    reject(err);
                }
                else
                {         
                    console.log("resultado comando sql:", results);
                    resolve(results);
                }
         
            });            

        });

    },

    delete(id)
    {

        return new Promise ((resolve, reject) =>
        {

            conn.query(`
                DELETE FROM tb_menus WHERE id = ?
            `, 
            [id], 
            (err, results) =>
            {
                if (err)
                {
                    reject(err)
                }
                else
                {
                    resolve(results);
                }
            });

        });

    }

};