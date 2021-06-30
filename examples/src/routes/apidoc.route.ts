/**
 * @api {get} /user/:id Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {String} firstname Firstname of the User.
 * @apiSuccess {String} lastname  Lastname of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe"
 *     }
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "UserNotFound"
 *     }
 */

/**
 * @api {get} /lead/:id
 * @apiGroup Lead Group
 * @apiSuccess {Boolean} active        Specify if the account is active.
 * @apiSuccess {Object}  profile       Lead profile information.
 * @apiSuccess {Number}  profile.age   Lead profile age.
 * @apiSuccess {String}  profile.image Avatar-Image.
 */

/**
 * @api {get} /customer/:id
 * @apiName GetCustomer
 * @apiGroup Customer
 * @apiParam {Number} id Customer unique ID.
 */

/**
 * @api {post} /user/
 * @apiGroup User
 * @apiBody {String} [firstname]       Optional Firstname of the User.
 * @apiBody {String} lastname          Mandatory Lastname.
 * @apiBody {String} country="DE"      Mandatory with default value "DE".
 * @apiBody {Number} [age=18]          Optional Age with default 18.
 *
 * @apiBody (Login) {String} pass      Only logged in users can post this.
 *                                      In generated documentation a separate
 *                                      "Login" Block will be generated.
 *
 * @apiBody {Object} [address]         Optional nested address object.
 * @apiBody {String} [address[street]] Optional street and number.
 * @apiBody {String} [address[zip]]    Optional zip code.
 * @apiBody {String} [address[city]]   Optional city.
 */
