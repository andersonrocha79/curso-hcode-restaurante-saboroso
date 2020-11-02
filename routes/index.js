var conn         = require('./../inc/db');
var express      = require('express');
var router       = express.Router();
var menus        = require('./../inc/menus');
var reservations = require('./../inc/reservations');
var contacts     = require('./../inc/contacts');

router.get('/', function(req, res, next) 
{

   menus.getMenus().then(results => 
   {

      res.render('index', 
      { 
         title: "Restaurante Saboroso",
         menus: results 
      });

   });

});

router.get("/contacts", function(req, res, next)
{

   contacts.render(req, res);

});

router.get("/menus", function(req, res, next)
{

   menus.getMenus().then(results => 
   {

      res.render('menus', 
      { 
         title: "Menu",
         background: "images/img_bg_1.jpg",
         h1: "Saboreie nosso menu!",  
         menus: results 
      });

    });   
    
});

router.get("/reservations", function(req, res, next)
{

   reservations.render(req, res);

});

router.post("/reservations", function(req, res, next)
{

    // res.send(req.body);
    /*
      {
      "name": "Anderson Rocha",
      "email": "andersonrocha1979@gmail.com",
      "people": "2",
      "date": "06/11/2020",
      "time": "20:00"
      }        
    */

   if (!req.body.name)
   {
      reservations.render(req, res, "Digite o nome");
   }
   else if (!req.body.email)
   {
      reservations.render(req, res, "Digite o e-mail");
   }
   else if (!req.body.people)
   {
      reservations.render(req, res, "Digite o número de pessoas");
   }
   else if (!req.body.date)
   {
      reservations.render(req, res, "Informe a data para reserva");
   }
   else if (!req.body.time)
   {
      reservations.render(req, res, "Informe a hora para reserva");
   }
   else
   {
      reservations.save(req.body).then(results =>
      {

         // registro incluído com sucesso
         // zera o body para apagar os dados digitados pelo usuário
         req.body = {};

         // renderiza a página com os novos parâmetros
         reservations.render(req, res, null, "Reserva realizada com Sucesso");

      }).catch( err =>
      {
         // se ocorrer algum erro, exibe ao usuário
         reservations.render(req, res, err.message, null);
      });   
   }

});

router.post("/contacts", function(req, res, next)
{

    // res.send(req.body);
    /*
      {
      "name": "Anderson Rocha",
      "email": "andersonrocha1979@gmail.com",
      "message": "mensagem"
      }        
    */

   if (!req.body.name)
   {
      contacts.render(req, res, "Digite o nome");
   }
   else if (!req.body.email)
   {
      contacts.render(req, res, "Digite o e-mail");
   }
   else if (!req.body.message)
   {
      contacts.render(req, res, "Digite a mensagem");
   }
   else
   {
      contacts.save(req.body).then(results =>
      {

         // registro incluído com sucesso
         // zera o body para apagar os dados digitados pelo usuário
         req.body = {};

         // renderiza a página com os novos parâmetros
         contacts.render(req, res, null, "Mensagem enviada com sucesso!");

      }).catch( err =>
      {
         // se ocorrer algum erro, exibe ao usuário
         contacts.render(req, res, err.message, null);
      });   
   }

});


router.get("/services", function(req, res, next)
{
    res.render('services', 
    { 
       title: "Serviços",
       background: "images/img_bg_1.jpg",
       h1: "É um prazer poder servir!"

    });
});

module.exports = router;
