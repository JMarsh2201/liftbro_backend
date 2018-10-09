const Group = require('../models/exercises').group;
const Exercise = require('../models/exercises').exercise;
const sendResponse = require('../utilities/response')

module.exports = function(router) {
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

  // router.route('/groups/:group_id')
  //   .get(function(req, res) {
  //     Group.findById(req.params.group_id, function(err, group) {
  //       if (err)
  //         res.send(err);
  //       res.json(group);
  //     })
  //     // not sure about this one vvvv
  //     .populate('exercises', 'group', 'group')
  //   })
  //
  router.route('/groups/:group_id/exercises')
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
