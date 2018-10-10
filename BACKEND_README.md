## LiftBro Backend


#### to start:
```
npm run dev
```
#### Routes:

##### naming convention for all posts: please capitalize each new non-key word. ex. exercise: "Incline Barbell Press"

- Get muscle groups
 - this should be viewed as a drop down list the user can select from. also populates corresponding exercises (with checkboxes).


- Post muscle groups
 - for internal use only. Used to post a new muscle group (i.e. Back, Shoulders, etc) in the following key value pair:
 muscle: "<muscle group name>"


- Get exercises
 - shows exercises for specific muscle group ID


- Post exercise
  - for internal use only. will accept JSON format in Postman. In order to do so, data type should be switched from 'x-www-form-urlencoded' to 'raw'. and text type dropdown should be switched from 'text' to 'JSON'. Data should be an array of objects. ex: [{exercise: Jumping Jacks}, {exercise: Push-Ups}, {exercise: Crunches}]
