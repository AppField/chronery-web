import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {Work} from '../../models/work';
import * as d3 from 'd3';

@Component({
	selector: 'chy-working-hours-chart',
	templateUrl: './working-hours-chart.component.html',
	styleUrls: ['./working-hours-chart.component.scss']
})
export class WorkingHoursChartComponent implements OnInit, OnChanges {
	@ViewChild('chart') private chart: ElementRef;
	@Input() data: Work[];

	private width: number;
	private height: number;
	private svg;

	constructor() {
	}

	ngOnInit() {
		this.createChart();
		if (this.data) {
			this.updateChart();
		}
	}

	ngOnChanges() {
		if (this.chart) {
			this.updateChart();
		}
	}

	private createChart(): void {
		const element = this.chart.nativeElement;
		this.width = element.offsetWidth;
		this.height = element.offsetHeight;

		this.svg = d3.select(element)
			.append('svg')
			.attr('width', this.width)
			.attr('height', this.height);


		const g = this.svg.append('g')
			.attr('transform', function (d, i) {
				return 'translate(0,0)';
			});

		g.append('ellipse')
			.attr('cx', 250)
			.attr('cy', 50)
			.attr('rx', 150)
			.attr('ry', 50)
			.attr('fill', 'green')
			.attr('opacity', 0.5);

		g.append('text')
			.attr('x', 140)
			.attr('y', 50)
			.attr('stroke', 'steelblue')
			.text('I a a pretty ellipse!');

		// this.svg.append('line')
		// 	.attr('x1', 20)
		// 	.attr('x2', 20)
		// 	.attr('y1', 20)
		// 	.attr('y2', this.height - 20)
		// 	.attr('stroke', 'black');
		//
		// this.svg.append('line')
		// 	.attr('x1', 20)
		// 	.attr('x2', this.width - 20)
		// 	.attr('y1', this.height - 20)
		// 	.attr('y2', this.height - 20)
		// 	.attr('stroke', 'black');

		// 		.data(this.data)
		// 		.enter()
		// 		.append('p')
		// 		.text(function (d: any) {
		// 			return `${d.date}, ${d.from}, ${d.to}, ${d.spent}`;
		// 		});
		// }
	}

	private updateChart() {

	}
}
