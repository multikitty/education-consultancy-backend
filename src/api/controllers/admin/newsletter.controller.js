const Newsletter = require('../../models/newsletter.model');
const { sendEmail } = require('../../utils/emails/emails')


exports.list = async (req, res, next) => {
    try {
        let { page, limit, email, ip, startDate, endDate } = req.query
        const filter = {}

        page = page !== undefined && page !== '' ? parseInt(page) : 1
        limit = limit !== undefined && limit !== '' ? parseInt(limit) : 10

        if (email) {
            filter.email = { $regex: email, $options: "gi" }
        }
        if (ip) {
            filter.ip = ip
        }
        if (startDate && endDate) {
            startDate = new Date(startDate)
            endDate = new Date(endDate)
            if (startDate.getTime() == endDate.getTime()) {
                filter.createdAt = { $gte: startDate }
            }
            else {
                filter['$and'] = [{ 'createdAt': { $gte: startDate } }, { 'createdAt': { $lte: endDate } }]
            }
        }


        const total = await Newsletter.countDocuments(filter)

        let newsletter = await Newsletter.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            {
                $project: {
                    _id: 1, email: 1, ip: 1, createdAt: 1
                }
            }
        ])

        return res.send({
            success: true,
            message: "Newsletters Retrieved Successfully.",
            data: {
                newsletter,
                pagination: {
                    page, limit, total,
                    pages: Math.ceil(total / limit) <= 0 ? 1 : Math.ceil(total / limit)
                }
            }
        });

    } catch (error) {
        return next(error);
    }
}

exports.sendEmailToSubscribers = async (req, res, next) => {
    let { emails, allSubscribers } = req.body;
    if (allSubscribers) {
        let subscribers = await Newsletter.find();
        let email = [];
        for (let x = 0; x < subscribers.length; x++) {
            email.push(subscribers[x].email);
        }
        await sendEmail(email, 'send-news-letter-subscription-email-admin');
    }
    else if (emails && emails.length > 0) {

        let email = [];
        for (let x = 0; x < emails.length; x++) {
            activeEmails = await Newsletter.find({ email: emails[x]})
            activeEmails.forEach(val => {
                email.push(val.email);
            });
        }
        await sendEmail(email, 'send-news-letter-subscription-email-admin');
    }
    return res.send({ status: true, message: "Email Sent Successfully." });
}   


