var path = require('path');

//Postgres DATABASE_URL = postgres://user:password@host:port/database
//SQite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user = (url[2] || null);
var pwd = (url[3] || null);
var protocol = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

//Cargar Modeo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
	{	dialect: dialect,
		protocol: protocol,
		port: port,
		host: host,
		storage: storage, //solo SQLite
		omitNull:true //solo Postgres
	}
);

//Importar definicion de la tabla Quiz
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar definicion de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //exportar definicion de tabla Quiz
exports.Comment = Comment; //exportar definicion de tabla Comment

//crear e inicializar tabla de preguntas en BD
sequelize.sync().then(function() {
	//then(..) ejecuta el manejador una vez creada la tabla	
	Quiz.count().then(function(count) {
		if (count === 0) { //la tabla se inicializa solo si esta vacia
			Quiz.create({pregunta: 'Capital de Italia', respuesta: 'Roma', temas: 'Otro'});
			Quiz.create({pregunta: 'Capital de Portugal',
				respuesta: 'Lisboa', temas: 'Otro'}).then(function() {
					console.log('Base de datos inicilizada');
				});				
		}
	});

});


