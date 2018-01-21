import moment from 'moment';

import 'moment/locale/id';

moment.locale('id');

const jwt = require('jsonwebtoken');

const methods = {};

methods.decode = token => jwt.decode(token);

methods.processMonthName = (period) => {
  switch (period) {
    case '1':
      return 'Januari';
    case '2':
      return 'Februari';
    case '3':
      return 'Maret';
    case '4':
      return 'April';
    case '5':
      return 'Mei';
    case '6':
      return 'Juni';
    case '7':
      return 'Juli';
    case '8':
      return 'Agustus';
    case '9':
      return 'September';
    case '10':
      return 'Oktober';
    case '11':
      return 'November';
    case '12':
      return 'Desember';
    default:
      return '';
  }
};

methods.processCreatedDate = date => moment(date).format('dddd, D MMMM YYYY');

export default methods;