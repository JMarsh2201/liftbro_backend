var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
  muscle: String,
  exercises: [{type: Schema.Types.ObjectId, ref:'exercise'}]
});

var ExerciseSchema = new Schema({
  exercise: String,
  group: {type: Schema.Types.ObjectId, ref:'group'}
});

 module.exports = {
   group: mongoose.model('group', GroupSchema),
   exercise: mongoose.model('exercise', ExerciseSchema)
 }
