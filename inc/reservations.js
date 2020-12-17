var conn       = require("./db");
var Pagination = require("./pagination");
var moment     = require("moment");

module.exports =
{

    render(req, res, error, success)
    {

        res.render('reservations', 
        { 
           title: "Reservas",
           background: "images/img_bg_2.jpg",
           h1: "Reserve uma Mesa!",
           body: req.body,
           error: error,
           success: success
        });

    },

    getReservations(req)
    {

        return new Promise((resolve, reject) =>
        {

            let page    = req.query.page;
            let dtStart = req.query.start;
            let dtEnd   = req.query.end;

            // se não informar página, indica que a página é 1
            if (!page) page = 1;

            // verifica se o periodo de datas foi informado
            let params = [];

            if (dtStart && dtEnd)
            {
                params.push(dtStart, dtEnd);
            }

            // o parâmetro SQL_CALC_FOUND_ROWS indica que deve armazenar no servidor a quantidade de registros existentes no comando (sem o limit)
            let pag = new Pagination(`SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations 
                                    ${(dtStart && dtEnd) ? 'WHERE date BETWEEN ? AND ?' : ''} 
                                    ORDER BY name LIMIT ?, ?`,
                                    params);

            pag.getPage(page).then(data =>
            {
                resolve({data, 
                         links : pag.getNavigation(req.query)
                        });
            });
                     
        });


            
    },

    save(fields)
    {

        return new Promise((resolve, reject) =>
        {

            // verifica se tem barra e faz a conversão
            if (fields.date.indexOf('/') > -1)
            {

                // 02/11/2020
                let date = fields.date.split('/');

                // 2020-11-02 (ano/mes/dia)
                fields.date = `${date[2]}-${date[1]}-${date[0]}`;
                
            }

            let query;
            let params = [fields.name, fields.email, fields.people, fields.date, fields.time];

            if (parseInt(fields.id) > 0)
            {
                query = `
                UPDATE tb_reservations 
                set name = ?,
                email = ?, 
                people = ?, 
                date = ?, 
                time = ?
                WHERE id = ?
                `;
                params.push(fields.id);
            }
            else
            {
                query = `
                INSERT INTO tb_reservations 
                (name, email, people, date, time)
                VALUES
                (?, ?, ?, ?, ?)
                `;
            }

            conn.query(query, params,
            (err, results) =>
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

    delete(id)
    {

        return new Promise ((resolve, reject) =>
        {

            conn.query(`
                DELETE FROM tb_reservations WHERE id = ?
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

    getChart(req)
    {
        
        return new Promise((resolve, reject) =>
        {

            conn.query(
            `            
                SELECT
                   CONCAT(YEAR(date), '-', MONTH(date)) AS date,
                   COUNT(*) AS total,
                   SUM(people) / COUNT(*) AS avg_people
                FROM  tb_reservations
                WHERE date BETWEEN ? AND ?
                GROUP BY YEAR(date), MONTH(date)
                ORDER BY YEAR(date), MONTH(date);
            `,
            [req.query.start, req.query.end],
            (err, results)=>
            {
                if (err)
                {
                    reject(err);
                }
                else
                {

                    let months = [];
                    let values = [];

                    results.forEach(row =>
                    {
                       months.push(moment(row.date).format('MMM YYYY'));
                       values.push(row.total);
                    });

                    resolve({months, values});

                }
            });
                     
        });        

    },

    getDashboard()
    {

        return new Promise((resolve, reject) =>
        {

            conn.query(
                `SELECT
                (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                (SELECT COUNT(*) FROM tb_users) AS nrusers;`,
                (err, results) =>
                {
    
                    if (err)
                    {
                        reject(err);
                    }
                    else
                    {   
                        resolve(results[0]);
                    }
    
                });        
                             
        });

    }

}