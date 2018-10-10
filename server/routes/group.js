const Group = require('../models/exercises').group;
const Exercise = require('../models/exercises').exercise;
const sendResponse = require('../utilities/response')
const mongoose = require('mongoose')

module.exports = function(router) {
  // view all muscle groups and corresponding exercises.
  router.route('/groups')
    .get((req, res) => {
      Group.find()
        .populate('exercises')
        .exec((err, groups) => {
          if (err)
            res.send(err)
          res.json(groups);
        });
    })
    // internal use only. users will not post. adds {muscle: <muscle group>}
    .post((req, res) => {
      const group = new Group()
      const { body } = req
      for (let key in body) {
        if (body.hasOwnProperty(key)) {
          group[key] = body[key];
        }
      }
      group.save((err) => {
        sendResponse(err, res, "group created")
      })
    })


  // get checkbox selected exercises.
  router.route('/select_exercises/:selected')
    .get((req, res) => {
      const exArr = req.params.selected.split('%').map(x => mongoose.Types.ObjectId(x))
      Exercise.find({ '_id': { $in: exArr }},
        (err, exercises) => {
          if (err) res.send(err)
          res.json(exercises)
        });
      })

  router.route('/groups/:group_id/exercises')
  // get all exercises for specific muscle group.
    .get((req, res) => {
      Group.findById(req.params.group_id, (err, group) => {
          if (err)
            res.send(err);
        })
        .populate('exercises')
        .exec((err, group) => {
          if (err)
            res.send(err)
          res.json(group.exercises)
        })
    })
    // internal use only. users will not post. adds {exercise: <exercise name>}
    .post((req, res) => {
      Group.findById(req.params.group_id, (err, group) => {
        if (err) {
          res.send(err)
        } else {
          const { body } = req
          let exercises;
          if (Array.isArray(body)) {
            exercises = body.map((exercise) => {
              return formatExercise(exercise)
            })
          } else {
            exercises = formatExercise(body)

          }
          Exercise.create(exercises, (err, savedExercises) => {
            if (err) res.send(err)
            savedExercises.forEach((exercise) => {
              group.exercises.push(exercise)

            })
            group.save((err) => {
              if (err)
                res.send(err)
              sendResponse(err, res, "created")
            })

          })
          function formatExercise( singleExercise ) {
            const exercise = {}
            exercise.exercise = singleExercise.exercise
            exercise.group = group._id

            return exercise

          }
        }
      })
    })
}
