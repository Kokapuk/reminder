import { defineStore } from 'pinia';
import { useSettingsStore } from './settings';
import Locales from '../locales/index.json';

const millisecondsPerSecond = 1000;
const millisecondsPerMinute = millisecondsPerSecond * 60;
const millisecondsPerHour = millisecondsPerMinute * 60;
const millisecondsPerDay = millisecondsPerHour * 24;
const millisecondsPerWeek = millisecondsPerDay * 7;
// const millisecondsPerMonth = millisecondsPerDay * 28;
const millisecondsPerYear = millisecondsPerDay * 365;
const language = useSettingsStore().getLanguage() in Locales ? useSettingsStore().getLanguage() : 'en';

export const useDateStore = defineStore('date', {
  actions: {
    getNulifiedDate(dateToNulify) {
      let dateCopy = new Date(dateToNulify.getTime());

      dateCopy.setHours(0);
      dateCopy.setMinutes(0);
      dateCopy.setSeconds(0);
      dateCopy.setMilliseconds(0);

      return dateCopy;
    },
    millisecondsPerMonth(year, month) {
      return new Date(year, month, 0).getDate() * millisecondsPerDay;
    },
    dateToFullString(date) {
      if (date === 0) {
        return Locales[language].never;
      }

      date = new Date(date);
      var dateNow = new Date(Date.now());
      var time = this.dateToTimeString(date.getTime());

      if (dateNow.toLocaleDateString() === date.toLocaleDateString()) {
        return `${Locales[language].today}, ${time}`;
      }

      if (Math.abs(this.getNulifiedDate(dateNow).getTime() - this.getNulifiedDate(date).getTime()) >= millisecondsPerYear) {
        dateNow = this.getNulifiedDate(dateNow);
        date = this.getNulifiedDate(date);

        const timeDifference = dateNow.getTime() - date.getTime();
        const yearsToRemind = Math.floor(Math.abs(timeDifference) / millisecondsPerYear);

        if (timeDifference > 0) {
          return `${yearsToRemind} ${yearsToRemind > 1 ? Locales[language].years : Locales[language].year} ${Locales[language].ago}`;
        } else {
          return `${Locales[language].in} ${yearsToRemind} ${yearsToRemind > 1 ? Locales[language].years : Locales[language].year}`;
        }
      }

      if (
        Math.abs(this.getNulifiedDate(dateNow).getTime() - this.getNulifiedDate(date).getTime()) >=
        this.millisecondsPerMonth(date.getFullYear(), date.getMonth())
      ) {
        dateNow = this.getNulifiedDate(dateNow);
        date = this.getNulifiedDate(date);

        const timeDifference = dateNow.getTime() - date.getTime();
        const monthsToRemind = Math.floor(Math.abs(timeDifference) / this.millisecondsPerMonth(date.getFullYear(), date.getMonth()));

        if (timeDifference > 0) {
          return `${monthsToRemind} ${monthsToRemind > 1 ? Locales[language].months : Locales[language].month} ${Locales[language].ago}`;
        } else {
          return `${Locales[language].in} ${monthsToRemind} ${monthsToRemind > 1 ? Locales[language].months : Locales[language].month}`;
        }
      }

      if (Math.abs(this.getNulifiedDate(dateNow).getTime() - this.getNulifiedDate(date).getTime()) >= millisecondsPerDay * 2) {
        dateNow = this.getNulifiedDate(dateNow);
        date = this.getNulifiedDate(date);

        const timeDifference = dateNow.getTime() - date.getTime();

        if (Math.abs(timeDifference) > millisecondsPerWeek - millisecondsPerDay) {
          const weeksToRemind = Math.floor(Math.abs(timeDifference) / millisecondsPerWeek);

          if (timeDifference > 0) {
            return `${weeksToRemind} ${weeksToRemind > 1 ? Locales[language].weeks : Locales[language].week} ${Locales[language].ago}, ${time}`;
          } else {
            return `${Locales[language].in} ${weeksToRemind} ${weeksToRemind > 1 ? Locales[language].weeks : Locales[language].week}, ${time}`;
          }
        }

        if (timeDifference > 0) {
          return `${Locales[language].last} ${Locales[language].days_of_week[date.getDay()]}, ${time}`;
        } else {
          return `${Locales[language].this} ${Locales[language].days_of_week[date.getDay()]}, ${time}`;
        }
      }

      if (dateNow.getDate() - date.getDate() === 1) {
        return `${Locales[language].yesterday}, ${time}`;
      }

      if (dateNow.getDate() - date.getDate() === -1) {
        return `${Locales[language].tomorrow}, ${time}`;
      }
    },
    dateToTimeString(date) {
      date = new Date(date);

      var fullTime = date.toLocaleTimeString().split(':');
      var time = fullTime[0] + ':' + fullTime[1];

      return time;
    },
  },
});
