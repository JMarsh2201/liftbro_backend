const Group = require('../models/exercises').group;
const Exercise = require('../models/exercises').exercise;
const Response = require('../utilities/response')

module.exports = function(router) {
  router.route('/groups')
    .get(function(req, res) {
      Group.
        find().
        populate('exercises').
        exec(function (err, group) {
          if (err)
            res.send(err)
          res.json(group);
        });
    });

  router.route('/groups/:group_id')
    .get(function(req, res) {
      Group.findById(req.params.group_id, function(err, group) {
        if (err)
          res.send(err);
        res.json(group);
      })
      // not sure about this one vvvv
      .populate('exercises', 'exercise', 'group')
    })

  router.route('/groups/:group_id/exercises')
    .get(function(req, res) {
      Group.findById(req.params.group_id, function(err, group) {
          if (err)
            res.send(err);
        })
        .populate('exercises', 'exercise')
        .exec(function(err, group) {
          if (err)
            res.send(err)
          res.json(group.exercises)
        })


    })

  router.route('/groups/:group_id/:exercise_id')
    .put(function(req, res) {
      Exercise.findById(req.params.exercise_id, function(err, exercise) {
        if (err)
          res.send(err);
        res.json(group.exercises._id)
        })
    })


}
