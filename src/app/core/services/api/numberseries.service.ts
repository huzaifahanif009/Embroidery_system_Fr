import { Injectable } from '@angular/core';
import { BaseApiService } from './base-api.service';
import { NumberSeries } from './api.models';

@Injectable({ providedIn: 'root' })
export class NumberSeriesService extends BaseApiService<NumberSeries> {
    protected override endpoint = 'numbering-series';
}