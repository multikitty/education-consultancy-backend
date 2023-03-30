const Settings = require('../../models/settings.model')
const Mail = require('../../models/email.model')
const {emailAdd,mailgunDomain,mailgunApi} = require('../../../config/vars')

//send email to mentioned users
exports.sendEmail = async (email = '', type = '', content = null, subject = '') => {
  if (email) {
    const getTemplate = await Mail.findOne({ type })
    if (getTemplate) {
      let setting = await Settings.findOne()
      let api=setting?.api ? setting?.api : '';
      let domain=setting?.domain ? setting?.domain : '';
      let siteEmail=setting?.email ? setting?.email : '';      
      var mailgun = require('mailgun-js')({ apiKey: api, domain: domain });

      let sub = ''
      if(subject){
        sub = subject
      }
      else{
        sub = getTemplate.subject
      }

      const msg = {
        to: email,
        from: `Biiview <${siteEmail}>`,
        subject: sub,
        html: getHtml(getTemplate, content)
      };

      mailgun.messages().send(msg, function (err,body) {
        if (err) {
          console.log(err, "\u2B55")
        }
        else {
        console.log(body)
        }
      });
    }
  }
}

function getHtml(getTemplate, content) {
  let text = getTemplate.text
  if (content) {
    for (let key in content) {
      text = text.replace(`${key}`, "'" + `${content[key]}` + "'")
    }
  }
  return text
}







