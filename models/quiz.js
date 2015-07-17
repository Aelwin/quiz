module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz', {
		pregunta: { type: DataTypes.STRING, validate: { notEmpty: { msg: "-> Falta pregunta" } } },
		respuesta: { type: DataTypes.STRING, validate: { notEmpty: { msg: "-> Falta respuesta" } } },
		temas: { type: DataTypes.ENUM, values: ['Otro', 'Humanidades', 'Ocio', 'Ciencia', 'Tecnología'] }
	});
}
