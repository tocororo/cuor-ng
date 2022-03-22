
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { Aggr } from 'toco-lib';

import { ChartType } from "./chart-utils";

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit
{
  /**
   * Represents the `ChartType` enum for internal use. 
   */
   public readonly chartType: typeof ChartType;

    @Input()
    public aggregation_value: Aggr;

    @Input()
    public _yAxisLabel: string;

    @Input()
    public currentChartType: ChartType;
    public charts: Array<any>;

    @Output()
    public aggrSelected = new EventEmitter<object>();

    public constructor()
    {
        this.chartType = ChartType;

        this.currentChartType = undefined;
    }

    public ngOnInit(): void
    {
        this.charts = new Array()

        for (let index = 0; index < this.aggregation_value.buckets.length; ++index)
        {
            this.charts.push(
                {
                    name: this.aggregation_value.buckets[index].key,
                    value: this.aggregation_value.buckets[index].doc_count
                }
            );
        }
    }

    public _aggrSelect(new_aggr): void
    {
        this.aggrSelected.emit(new_aggr)
    }

    // @Input() dataMulti = multi
    // @Input() dataSingle = single
    // @Input() type: string = 'Vertical Bar'
    // @Input() xAxis =
    // @Input() yAxis =
    //dataMulti = multi
    //dataSingle = single
}
