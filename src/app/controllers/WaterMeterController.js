const WaterMeter = require("../model/WaterMeter");
const User = require("../model/User");


class WaterMeterController {
    showAll(req, res, next) {
        WaterMeter.find({})
            .then((waterMeters) => res.json(waterMeters))
            .catch(next);
    }

    show(req, res, next) {
        WaterMeter.find({ _id: req.params.id })
            .then((waterMeters) => res.json(waterMeters))
            .catch(next);
    }

    create(req, res, next) {
        const waterMeter = new WaterMeter(req.body);
        waterMeter
            .save()
            .then((waterMeters) => res.json(waterMeters))
            .catch((error) => { });
    }

    update(req, res, next) {
        WaterMeter.updateOne({ _id: req.params.id }, req.body)
            .then(res.status(200).json("Updated successfully!"))
            .catch(next);
    }

    delete(req, res, next) {
        WaterMeter.deleteOne({ _id: req.params.id })
            .then((waterMeters) => {
                res.status(200).json("Deleted successfully");
            })
            .catch(next);
    }

    async userOfWaterMeter(req, res, next) {
        try {
            const waterMeterId = req.params.id;

            // Kiểm tra xem WaterMeter có tồn tại không
            const waterMeter = await WaterMeter.findById(waterMeterId);
            if (!waterMeter) {
                return res.status(404).json({ error: 'WaterMeter not found' });
            }

            // Lấy thông tin User của WaterMeter
            const user = await User.findById(waterMeter.userId);
            res.json(user);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new WaterMeterController();
