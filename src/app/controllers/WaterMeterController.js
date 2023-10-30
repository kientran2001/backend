const WaterMeter = require("../model/WaterMeter");

class WaterMeterController {
  show(req, res, next) {
    WaterMeter.find({})
      .then((waterMeters) => res.json(waterMeters))
      .catch(next);
  }

  create(req, res, next) {
    const waterMeter = new WaterMeter(req.body);
    waterMeter
      .save()
      .then((waterMeters) => res.json(waterMeters))
      .catch((error) => {});
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
}

module.exports = new WaterMeterController();
