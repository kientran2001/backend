const User = require("../model/User");
const WaterMeter = require("../model/WaterMeter");

class UserController {
    showAll(req, res, next) {
        User.find({})
            .then((users) => res.json(users))
            .catch(next);
    }

    show(req, res, next) {
        User.find({ _id: req.params.id })
            .then((user) => res.json(user))
            .catch(next);
    }

    create(req, res, next) {
        const user = new User(req.body);
        user
            .save()
            .then((users) => res.json(users))
            .catch((error) => { });
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

    async waterMetersOfUser(req, res, next) {
        try {
            const id = req.params.id;
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            // Lấy toàn bộ WaterMeter của User
            const waterMeters = await WaterMeter.find({ userId: id });
            res.json(waterMeters);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = new UserController();
