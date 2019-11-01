import { NativeDateAdapter } from '@angular/material';

export class AppDateAdapter extends NativeDateAdapter {

  // tslint:disable-next-line: ban-types
  format(date: Date, displayFormat: Object): string {

    function getWeekDayABC(date) {
      const days = ['Sun', 'Mon', 'Tut', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[date.getDay()];
    }

    function getMonthABC(date) {
      const months = [0, 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[date.getMonth() + 1];
    }
    // getWeekDay(date => {
    //   const days = ['Sun', 'Mon', 'Tut', 'Wed', 'Thu', 'Fri', 'Sat'];
    //   return days[date.getDay()];
    // });

    if (displayFormat === 'my_format') {

      const getWkDay = getWeekDayABC(date);
      const day = date.getDate();
      const month = getMonthABC(date);
      const year = date.getFullYear();

      return `${getWkDay}, ${day} ${month}, ${year}`;
    }

    return date.toDateString();
  }
}
