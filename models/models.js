var path = require('path');

//Cargar Modeo ORM
var Sequelize = require('sequelize');

//Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null, {dialect: "sqlite", storage: "quiz.sqlite"});

var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; //exportar definicion de tabla Quiz

//crear e inicializar tabla de preguntas en BD
sequelize.sync().then(function() {
	//then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count) {
		if (count === 0) { //la tabla se inicializa solo si esta vacia
			Quiz.create({pregunta: 'Capita de Italia',
				respuesta: 'Roma'}).then(function() {
					console.log('Base de datos inicilizada');
				});
		}
	});
});