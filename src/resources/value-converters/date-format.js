import moment from 'moment';
import numeral from 'numeral';

export class DateFormatValueConverter {
  toView(value, format) {
    if (format === 'daysToHoursDays') {
      if (value <= 2) {
        return (numeral(value * 24).format('0,0')) + 'h';
      } else if (value < 3.5) {
        return (numeral(value).format('0,0.0')) + 'd';
      } else {
        return (numeral(value).format('0,0')) + 'd';
      }
    }

    if (format === 'daysToHoursDaysLong') {
        if (numeral(value * 24).format('0,0')=='1')
            return "1 Hour";
        else if (value <= 2) {
            return (numeral(value * 24).format('0,0')) + ' Hours';
        } else if (value < 3.5) {
            return (numeral(value).format('0,0.0')) + ' Days';
        } else {
            return (numeral(value).format('0,0')) + 'Days';
        }
    }

    return moment(value).format(format);
    //return moment(value).format('M/D/YYYY h:mm:ss a');
  }
}
