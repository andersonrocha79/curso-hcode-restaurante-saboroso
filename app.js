var createError   = require('http-errors');
var express       = require('express');
var path          = require('path');
var cookieParser  = require('cookie-parser');
var logger        = require('morgan');
var formidable    = require('formidable');
var http          = require('http');
var socket        = require('socket.io');
var path          = require('path');


var redis         = require('redis')
var session       = require('express-session')
var RedisStore    = require('connect-redis') (session)

var app           = express();

var http          = http.Server(app);
var io            = socket(http);

io.on('connection', function(socket)
{
   console.log('novo usuário conectado');
});

var indexRouter   = require('./routes/index')(io);
var adminRouter   = require('./routes/admin')(io);

// cria um middleware para interceptar
// as chamadas ao servidor que sejam referente
// envio de formulários
// esta função irá tratar os campos e arquivos anexos
// enviados pelos formulários
app.use(function (req, res, next)
{

   // sempre existe 'body' em qualquer chamada
   req.body = {};

   // só passa pelo middeware se for uma requisição 'POST'
   // que possa ter algum formulário de dados enviado
   if (req.method === 'POST')
   {

      var form = formidable.IncomingForm(
      {
         uploadDir: path.join(__dirname, "/public/images"),
         keepExtensions: true
      });

      form.parse(req, function(err, fields, files)
      {

         // inclui na chamada 'req'
         // os campos e arquivos já extraídos pelo 'formidable'
         req.body   = fields;
         req.fields = fields;
         req.files  = files;

         // vai para o próximo middeware ou próxima rota
         next();

      });

   }
   else
   {
      // vai para o próximo
      next();
   }

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

let redisClient = redis.createClient(
{
   host: 'localhost',
   port: 6379,
   db: 1,
 });

 redisClient.unref();
 redisClient.on('error', console.log)
 
let store = new RedisStore({ client: redisClient })

app.use( session (
{
   store: store,   
   secret: 'password',
   resave: true,
   saveUninitialized: true
}));

app.use(logger('dev'));
// app.use(express.json()); ha versão nova do express foi removido
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/'     , indexRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
   next(createError(404));
});

// error handler
app.use(function(err, req, res, next) 
{

   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
   
});

http.listen(3000, function()
{
   console.log('servidor em execução...');
});
