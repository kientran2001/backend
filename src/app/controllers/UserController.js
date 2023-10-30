const User = require("../model/User");

class UserController {
  show(req, res, next) {
    User.find({})
      .then((users) => res.json(users))
      .catch(next);
  }

  create(req, res, next) {
    const user = new User(req.body);
    user
      .save()
      .then((users) => res.json(users))
      .catch((error) => {});
  }

  update(req, res, next) {
    User.updateOne({ _id: req.params.id }, req.body)
      .then(res.status(200).json("Updated successfully!"))
      .catch(next);
  }

  delete(req, res, next) {
    User.deleteOne({ _id: req.params.id })
      .then((users) => {
        res.status(200).json("Deleted successfully");
      })
      .catch(next);
  }
}

module.exports = new UserController();
