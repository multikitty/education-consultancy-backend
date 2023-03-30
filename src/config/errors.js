/**
 * Catch 422 for duplicate key
 * @public
 */
exports.checkDuplicate = (err, res, name = '') => {
    if (err.code === 11000 || err.code === 11001) {
        let message = `${name} with same `;
        if (err.errmsg.includes('name_1'))
            message += 'name already exists';
        else if (err.errmsg.includes('email_1'))
            message += 'email already exists';
        else {
            const pathRegex = err.message.match(/\.\$([a-z]+)/)
            const path = pathRegex ? pathRegex[1] : '';
            const keyRegex = err.message.match(/key:\s+{\s+:\s\"(.*)(?=\")/)
            const key = keyRegex ? keyRegex[1] : '';

            message = `'${path}' '${key}' already exists`
        }
        return res.status(200).send({ success: false, message });
    }
};