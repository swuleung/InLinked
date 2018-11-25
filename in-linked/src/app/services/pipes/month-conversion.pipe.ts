import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'MonthConversion'})
export class MonthConversionPipe implements PipeTransform {
    private months = [
    'N/A', 'Jan', 'Feb', 'Mar', 'Apr', 'May',
    'Jun', 'Jul', 'Aug', 'Sep',
    'Oct', 'Nov', 'Dec'
    ];
    transform(value: number): string{
        return (value > 0 && value < 13) ? this.months[value] : this.months[0];
    }
}