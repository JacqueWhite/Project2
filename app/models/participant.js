//Example Participant model.
//TODO: Define the data and functions we'll need for each Participant.

module.exports = function(sequelize, DataTypes) {

	var Participant = sequelize.define("Participant", {
	  email: {
	    type: DataTypes.STRING,
	    allowNull: false
	  },
		avatar: {
	    type: DataTypes.STRING,
	    allowNull: true
	  },
		name: {
	    type: DataTypes.STRING,
	    allowNull: true
	  },
	  stripeToken: {
	    type: DataTypes.STRING,
	    defaultValue: null
	  }
	});

	Participant.associate = function(models) {
	  Participant.belongsTo(models.Event, {
			foreignKey: {
				allowNull: false
			}
	  });
	};

return Participant;

};
