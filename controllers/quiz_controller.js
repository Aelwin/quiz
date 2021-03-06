var models = require('../models/models.js');

//Autoload - refactoriza el codigo si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
			where: {id: Number(quizId)},
			include: [{model: models.Comment}]
		}).then(function(quiz) {		
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId = ' + quizId));
		}
	}).catch(function(error) { next(error); });
};

//GET /quizes
exports.index = function(req, res, next) {
	var search = req.query.search? "%" + req.query.search + "%" : "%";
	search = search.replace(" ", "%");
	console.log("Buscando preguntas que contengan: " + search);
	models.Quiz.findAll({ where: ['pregunta like ?', search ], order: 'pregunta' }).then(function(quizes) {
		res.render('quizes/index', {quizes: quizes, errors: []});
	}).catch(function(error) { next(error); });
};

//GET /quizes/:id
exports.show = function(req, res) {	
	res.render('quizes/show', {quiz: req.quiz, errors: []});		
};

//GET /quizes/:id/answer
exports.answer = function(req, res) {	
	var resultado = 'Incorrecto';
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.new = function(req, res) {
	var quiz = models.Quiz.build({ pregunta: "Pregunta", respuesta: "Respuesta" });
	var listaTemas = models.Quiz.rawAttributes.temas.values;
	res.render('quizes/new', {quiz: quiz, listaTemas: listaTemas, errors: []});
}

exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err) {
		if (err) {
			var listaTemas = models.Quiz.rawAttributes.temas.values;
			res.render('quizes/new', {quiz: quiz, listaTemas: listaTemas, errors: err.errors});
		} else {
			//guarda en DB los campos pregunta y respuesta de quiz
			quiz.save({ fields: ["pregunta", "respuesta", "temas"] }).then(function() {
				res.redirect('/quizes');
			});
		}
	});	
}

exports.edit = function(req, res) {
	var quiz = req.quiz;	
	var listaTemas = models.Quiz.rawAttributes.temas.values;
	res.render('quizes/edit', {quiz: quiz, listaTemas: listaTemas, errors: []});
}

exports.update = function(req, res) {
	var quiz = req.quiz;
	quiz.pregunta = req.body.quiz.pregunta;
	quiz.respuesta = req.body.quiz.respuesta;
	quiz.temas = req.body.quiz.temas;

	quiz.validate().then(function(err) {
		if (err) {
			res.render('quizes/edit', {quiz: quiz, errors: err.errors});
		} else {
			//guarda en DB los campos pregunta y respuesta de quiz
			quiz.save({ fields: ["pregunta", "respuesta", "temas"] }).then(function() {
				res.redirect('/quizes');
			});
		}
	});	
}

exports.destroy = function(req, res) {
	var quiz = req.quiz;

	quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error) { next(error); });
	
}