module.exports = 
{

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
                text: "E-mails",
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