import {Pipe, PipeTransform} from '@angular/core';
import {AbService} from './service';

@Pipe({
    name: 'ab',
})
export class AbPipe implements PipeTransform {
    constructor(private AbService: AbService) {}

    transform(scope: string, version: string): boolean {
        return version === this.AbService.getVersion(scope);
    }
}
