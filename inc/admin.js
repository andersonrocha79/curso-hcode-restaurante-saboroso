
const { connect } = require("./db");
var conn = require('./db');

module.exports = 
{

    dashboard()
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
    ,    
    getParams(req, params)
    {

        // gera um novo objeto 
        // incluindo mais campos ao
        // objeto passado como parâmetro
        return Object.assign(
            {},
            {
                menus: req.menus,
                user: req.session.user
            },
            params);
    }
    ,
    getMenus(req)
    {

        let menus =
        [
            {
                text: "Tela inicial",
                href: "/admin/",
                icon: "home",
                active: false
            },
            {
                text: "Menu",
                href: "/admin/menus",
                icon: "cutlery",
                active: false
            },
            {
                text: "Reservas",
                href: "/admin/reservations",
                icon: "calendar-check-o",
                active: false
            },
            {
                text: "Contatos",
                href: "/admin/contacts",
                icon: "comments",
                active: false
            },
            {
                text: "Usuários",
                href: "/admin/users",
                icon: "users",
                active: false
            },
            {
                text: "e-mails",
                href: "/admin/emails",
                icon: "envelope",
                active: false
            }

        ];

        // percorre os itens do menu e verifica qual deve ser definido como 'active = true'
        menus.map(menu =>
        {

           // href: /admin/reservations 
           // url:  /reservations

            if (menu.href === `/admin${req.url}`) 
            {
                menu.active = true;
            }

        });

        return menus;

    }



}