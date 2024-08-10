using System.Globalization;

namespace HHBW
{
    public static class DateTimeExtensions
    {
        public enum Months : int
        {
            Jan = 1, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec,
        }

        public enum AMPM { AM, PM }

        public static DateTime ToCustomFormat(this DateTime dateTime, Months month = default, int day = default, int year = default, int hour = default, int minutes = default, AMPM aMPM = default)
        {
            if (month == default) month = (Months)DateTime.Now.Month;
            if (day == default) day = DateTime.Now.Day;
            if (year == default) year = DateTime.Now.Year;

            if (hour == default) hour = DateTime.Now.Hour;
            if (minutes == default) minutes = DateTime.Now.Minute;
            if (aMPM == default) aMPM = Enum.Parse<AMPM>(DateTime.Now.ToString("tt"));

            string format = "M/d/yyyy h:mmtt";
            CultureInfo provider = CultureInfo.InvariantCulture;
            return DateTime.ParseExact($"{(int)month}/{day}/{year} {hour}:{minutes:D2}{aMPM.ToString().ToLower()}", format, provider);
        }
    }
}
