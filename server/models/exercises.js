var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
  group: String,
  exercises: [{type: Schema.Types.ObjectId, ref:'Exercise'}]
});

var ExerciseSchema = new Schema({
  exercise: String,
  group: {type: Schema.Types.ObjectId, ref:'Group'}
});

 module.exports = {
   group: mongoose.model('Group', GroupSchema),
   exercise: mongoose.model('Exercise', ExerciseSchema)
 }
