import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {Work} from '../../models/work';
import * as d3 from 'd3';

interface WorkCharData {
	date: string;
	works: Work[];
}

@Component({
	selector: 'chy-working-hours-chart',
	templateUrl: './working-hours-chart.component.html',
	styleUrls: ['./working-hours-chart.component.scss']
})
export class WorkingHoursChartComponent implements OnInit, OnChanges {
	@ViewChild('chart') private chart: ElementRef;
	@Input() data: Work[];

	private chartData: WorkCharData[];
	private width: number;
	private height: number;
	private svg;

	private group;
	private xScale;
	private yScale;

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

		const data = [
			{year: '2011', value: 45},
			{year: '2012', value: 47},
			{year: '2013', value: 52},
			{year: '2014', value: 70},
			{year: '2015', value: 75},
			{year: '2016', value: 78}
		];

		const margin = 50;

		this.svg = d3.select(element).append('svg')
			.attr('width', this.width)
			.attr('height', this.height);

		this.width -= margin;
		this.height -= margin;


		this.xScale = d3.scaleBand().range([0, this.width]).padding(0.4);
		this.yScale = d3.scaleLinear().range([this.height, 0]);

		this.group = this.svg.append('g')
			.attr('transform', 'translate(' + margin / 2 + ',' + margin / 2 + ')');

		this.xScale.domain(data.map(function (d) {
			return d.year;
		}));
		this.yScale.domain([0, d3.max(data, function (d) {
			return d.value;
		})]);

		this.group.append('g')
			.attr('transform', 'translate(0,' + this.height + ')')
			.call(d3.axisBottom(this.xScale));

		this.group.append('g')
			.call(d3.axisLeft(this.yScale).tickFormat(function (d) {
				return '$' + d;
			}).ticks(10))
			.append('text')
			.attr('y', 6)
			.attr('dy', '0.71em');

		this.group.selectAll('.bar')
			.data(data)
			.enter().append('rect')
			.attr('class', 'bar')
			.on('mouseover', (d, i: number, r) => {
				this.onMouseOver(d, i, r)
			})
			.on('mouseout', (d, i: number, r) => {
				this.onMouseOut(d, i, r)
			})
			.attr('x', (d) => this.xScale(d.year))
			.attr('y', (d) => this.yScale(d.value))
			.attr('width', this.xScale.bandwidth())
			.transition()
			.ease(d3.easeLinear)
			.duration(400)
			.delay((d, i) => i * 50)
			.attr('height', (d) => this.height - this.yScale(d.value));

	}

	private updateChart(): void {
		this.adaptData();
	}

	private adaptData(): void {
		this.chartData = [];
		this.data.map((work: Work) => {
			if (this.chartData.length > 0) {
				if (this.chartData[this.chartData.length - 1].date === work.date) {
					this.chartData[this.chartData.length - 1].works.push(work);
				} else {
					this.chartData.push({
						date: work.date,
						works: [work]
					})
				}
			} else {
				this.chartData.push({
					date: work.date,
					works: [work]
				})
			}
		});
		console.log(this.chartData);
	}

	private onMouseOver(d, i: number, bars) {
		d3.select(bars[i]).attr('class', 'highlight');
		d3.select(bars[i])
			.transition()
			.duration(400)
			.attr('width', this.xScale.bandwidth() + 6)
			.attr('x', () => this.xScale(d.year) - 3)
			.attr('y', () => this.yScale(d.value) - 10)
			.attr('height', () => this.height - this.yScale(d.value) + 10);

		this.group.append('text')
			.attr('class', 'tooltip')
			.attr('x', () => this.xScale(d.year))
			.attr('y', () => this.yScale(d.value) - 15)
			.text(() => ['$' + d.value]);

	}

	private onMouseOut(d, i: number, bars): void {
		d3.select(bars[i]).attr('class', 'bar');
		d3.select(bars[i])
			.transition()
			.duration(400)
			.attr('width', this.xScale.bandwidth())
			.attr('x', this.xScale(d.year))
			.attr('y', () => this.yScale(d.value))
			.attr('height', () => this.height - this.yScale(d.value));

		d3.selectAll('.tooltip')
			.remove();
	}
}
