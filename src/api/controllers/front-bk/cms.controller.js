const ObjectId = require('mongoose').Types.ObjectId
const Cms = require('../../models/cms.model');

exports.get = async (req, res, next) => {
    try {
        let { slug } = req.params;
        if (slug) {
            let cms = await Cms.findOne({ slug, status: true }, { title: 1, description: 1, _id: 0 }).lean(true);
            return res.send({ success: true, message: "CMS Retrieved Successfully.", cms });
        }
        return res.send({ success: false, message: "Slug Is Required" });
    } catch (error) {
        return next(error);
    }
}

exports.list = async (req, res, next) => {
    try {
        let cms = await Cms.find({ status: true }, { title: 1, slug: 1, _id: 0 }).sort({ createdAt: -1 }).limit(5);

        return res.send({ success: true, message: "CMS Listing Retrieved successfully.", cms });
    } catch (error) {
        return next(error);
    }
};

