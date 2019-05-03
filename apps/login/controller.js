const BaseController = require('../../src/js/common/BaseController.js');

const config = require('./config.json');

class LoginController extends BaseController {
  constructor() {
    super({ path: config.path });
  }

  getRoot(req, res) {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      if (req.session.kioskMode == true) {
        res.render('kiosk');
      } else {
        res.render('login');
      }
    }
  }

  postRoot(req, res) {
    if (req.session.requested != undefined) {
      const requested = req.session.requested;
      delete req.session.requested;
      res.redirect(requested);
    } else {
      res.redirect('/checkout');
    }
  }
}

module.exports = LoginController;
