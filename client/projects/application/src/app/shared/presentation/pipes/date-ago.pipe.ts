import { DatePipe } from "@angular/common";
import { Inject, LOCALE_ID, Pipe, PipeTransform } from "@angular/core";

/**
 * Formats a date and time in a format showing how much time has passed since then.
 * If the date is too far in the past it shows it in a standard way.
 */
@Pipe({
    name: "appDateAgo",
    standalone: true
})
export class DateAgoPipe implements PipeTransform {
    private readonly datePipe: DatePipe;

    /**
     * @param locale Locale used to format the date.
     */
    constructor(@Inject(LOCALE_ID) locale: string) {
        this.datePipe = new DatePipe(locale);
    }

    transform(date: Date): string {
        const SECONDS_IN_MINUTE = 60;
        const SECONDS_IN_HOUR = 60 * SECONDS_IN_MINUTE;
        const SECONDS_IN_DAY = 24 * SECONDS_IN_HOUR;
        const SECONDS_IN_WEEK = 7 * SECONDS_IN_DAY;

        const nowDate = new Date();
        const secondsFromNow = (nowDate.getTime() - date.getTime()) / 1000;

        if (secondsFromNow < SECONDS_IN_MINUTE)
            return "Just now";
        if (secondsFromNow < 2 * SECONDS_IN_MINUTE)
            return "1 minute ago";
        if (secondsFromNow < SECONDS_IN_HOUR)
            return `${Math.floor(secondsFromNow / SECONDS_IN_MINUTE)} minutes ago`;
        if (secondsFromNow < 2 * SECONDS_IN_HOUR * 2)
            return "1 hour ago";
        if (secondsFromNow < SECONDS_IN_DAY)
            return `${Math.floor(secondsFromNow / SECONDS_IN_HOUR)} hours ago`;
        if (secondsFromNow < 2 * SECONDS_IN_DAY)
            return "1 day ago";
        if (secondsFromNow < SECONDS_IN_WEEK)
            return `${Math.floor(secondsFromNow / SECONDS_IN_DAY)} days ago`;

        if (date.getFullYear() === nowDate.getFullYear())
            return this.datePipe.transform(date, "MMMM d, h:mm a")!;
        else
            return this.datePipe.transform(date, "MMMM d, y, h:mm a")!;
    }
}
