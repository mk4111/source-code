'use strict';

const Joi = require('joi');
const getUserByIdGoogle = require('../../database-helpers/elasticsearch/get_user_by_id_google');

module.exports = function (request, reply) {

  if (!request.auth.isAuthenticated) {
    return reply.redirect('/login');
  }

  const schema = {
    email: Joi.required()
  };

  const validationObject = Joi.validate(request.payload, schema, { abortEarly: false, allowUnknown: true });

  if (!validationObject.error) {

    const emailList = request.payload.email;
    let emails =[];

    if (typeof emailList === 'string') {

       emails.push(JSON.parse(emailList));

    } else {

       emailList.forEach(function (emailObj) {

        emails.push(JSON.parse(emailObj));
      });
    }

    getUserByIdGoogle(request.auth.credentials.id, function (err, user) {


      return reply.view('email', {emails: emails, user:user, pathUrl: request.payload.pathUrl, request: request});
    })

  } else {

    return reply.redirect('/');
  }

}
