var conn = require("./db");
let path = require('path');

module.exports = 
{

    render(req, res, error, success)
    {

        res.render('admin/login', 
        { 
           body: req.body,
           error: error
        });

    },    

    login(email, password)
    {

        return new Promise((resolve, reject) =>
        {

            conn.query(`SELECT * FROM tb_users WHERE email = ?`, [email], (err, results)=>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {
                    if (results.length <= 0)
                    {
                       reject("Usuário ou senha incorretos");
                    }
                    else
                    {
                       let row = results[0];
                       if (row.password !== password)
                       {
                           reject("Usuário ou senha incorretos");
                       }
                       else
                       {
                           resolve(row);
                       }
                    }
                }
            });

        });

    },

    getUsers()
    {

        return new Promise((resolve, reject) =>
        {

            conn.query("SELECT * FROM tb_users ORDER BY name", (err, results) =>
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

            console.log('users-save > ', fields);

            let query;
            let params = [fields.name, fields.email];

            // verifica se é inclusão ou atualização
            if (parseInt(fields.id) > 0)
            {

                // inclui o 'id' nos parâmetros
                params.push(fields.id);

                query = `
                    UPDATE 
                        tb_users
                    SET 
                        name = ?,
                        email = ?
                    WHERE 
                        id = ?`;

            }
            else
            {

                // inclui a 'senha' nos parâmetros
                params.push(fields.password);
                
                query = `
                    INSERT INTO tb_users
                    (name, email, password)
                    VALUES 
                    (?, ?, ?)`;

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
                DELETE FROM tb_users WHERE id = ?
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

    },

    changePassword(req)
    {

        return new Promise((resolve, reject) =>
        {
            if (!req.fields.password)
            {
                reject("Preencha a senha.");
            }
            else if (req.fields.password !== req.fields.passwordConfirm)
            {
                reject("Senha não confere.");
            }
            else
            {
                conn.query(`
                            UPDATE tb_users 
                            SET password = ? 
                            WHERE id = ?`,
                            [req.fields.password, req.fields.id],
                            (err, results) =>
                            {
                                if (err) 
                                {
                                    reject(err.message);
                                }
                                else
                                {
                                    resolve(results);
                                }
                            });
            }

        });
    }


}