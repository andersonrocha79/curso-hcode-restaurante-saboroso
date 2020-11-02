var conn = require("./db");

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

    save(fields)
    {

        return new Promise((resolve, reject) =>
        {

            // 02/11/2020
            let date = fields.date.split('/');

            // 2020-11-02 (ano/mes/dia)
            fields.date = `${date[2]}-${date[1]}-${date[0]}`;

            conn.query(
            `        
                INSERT INTO tb_reservations 
                (name, email, people, date, time)
                VALUES
                (?, ?, ?, ?, ?)        
            `,
            [fields.name, fields.email, fields.people, fields.date, fields.time],
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


    }

}