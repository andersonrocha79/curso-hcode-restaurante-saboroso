var express = require("express");
var users   = require("./../inc/users");
var admin   = require("./../inc/admin");
var menus   = require("./../inc/menus");
var router  = express.Router();

// middeware para avaliar se o usuário já fez login
// antes de conseguir executar as outras rotas
// será executado antes de qualquer comando solicitado em 'router'
router.use(function (req, res, next)
{

    // registra a rota solicitada
    console.log("middleware : ", req.url );

    // verifica as rotas que não precisam de autorização para acesso
    if (['/login'].indexOf(req.url) == -1)
    {

        if (!req.session.user)    
        {
            console.log("sem autorização");
            res.redirect("/admin/login");
        }
        else
        {
            console.log("autorizado");
            // vai para o comando solicitado        
            next();
        }
    }
    else
    {

        console.log("não precisa de autorização");
        // vai para o comando solicitado        
        next();
        
    }
    
});

// midleware para incluir o array 'menus' em todas
// as chamadas a rota 'admin'
// este array tem as opções do menu lateral da página admin
router.use(function(req, res, next)
{
    // armazena o array de menus na requisição
    // passa como parâmetro a url atual, para definir qual o menu ativo
    req.menus = admin.getMenus(req);
    // vai para o próximo midleware ou próxima rota
    next();
});

router.get("/logout", function(req, res, next)
{

    delete req.session.user;
    console.log("usuário efetuou logoff");
    res.redirect("/admin/login");

});

router.get("/", function(req, res, next)
{

    // busca os dados do dashboard
    // depois renderiza a página
    admin.dashboard().then( data =>
    {

        res.render("admin/index", admin.getParams(req, { data : data } ));

    }).catch( err =>
    {
        console.log(err);
    });

    

});

router.post("/login", function(req, res, next)
{

    if (!req.body.email)
    {
        users.render(req, res, "O e-mail deve ser informado.");
    }
    else if (!req.body.password)
    {
        users.render(req, res, "A senha deve deve ser informada.");
    }
    else
    {
        users.login(req.body.email, req.body.password).then(user =>
        {

            // armazena os dados do usuário logado na sessão
            req.session.user = user;

            // login realizado com sucesso
            // redireciona para a página principal
            res.redirect("/admin");

        }).catch(err =>
        {
            // falha no login
            users.render(req, res, err.message || err);
        });
    }

});

router.get("/login", function(req, res, next)
{

    users.render(req, res, null);

});

router.get("/contacts", function(req, res, next)
{

    res.render("admin/contacts", admin.getParams(req));

});

router.get("/emails", function(req, res, next)
{

    res.render("admin/emails", admin.getParams(req));

});

router.get("/menus", function(req, res, next)
{

    menus.getMenus().then(data =>
    {

        res.render("admin/menus", admin.getParams(req, { data: data } ));

    }).catch(err =>
    {
       console.log(err) 
    });

});

router.post("/menus", function(req, res, next)
{

    res.send(req.body);
    
});

router.get("/reservations", function(req, res, next)
{

    res.render("admin/reservations", admin.getParams(req, {date: {}}));

});

router.get("/users", function(req, res, next)
{

    res.render("admin/users", admin.getParams(req));

});


module.exports = router;