import {Component, ElementRef, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {Work} from '../../models/work';
import * as moment from 'moment/moment';
import * as d3 from 'd3';

interface WorkChartData {
	date: string;
	works: Work[];
	totalTime: Date;
}

@Component({
	selector: 'chy-working-hours-chart',
	templateUrl: './working-hours-chart.component.html',
	styleUrls: ['./working-hours-chart.component.scss']
})
export class WorkingHoursChartComponent implements OnInit, OnChanges {
	@ViewChild('chart') private chart: ElementRef;
	@Input() data: Work[];

	private chartData: WorkChartData[];
	private width: number;
	private height: number;
	private svg: any;

	private group: any;
	private xScale: any;
	private yScale: any;
	private xAxis: any;
	private yAxis: any;
	private parseTime = d3.timeParse('%H:%M');

	constructor() {
	}

	ngOnInit() {
		this.createChart();
		if (this.data) {
			this.updateChart();
		}
	}

	ngOnChanges() {
		if (this.svg) {
			this.updateChart();
		}
	}

	private createChart(): void {
		this.adaptData();
		const element = this.chart.nativeElement;
		this.width = element.offsetWidth;
		this.height = element.offsetHeight;

		const margin = 70;

		this.svg = d3.select(element).append('svg')
			.attr('width', this.width)
			.attr('height', this.height);

		this.width -= margin;
		this.height -= margin;

		this.xScale = d3.scaleBand().range([0, this.width]).padding(0.2);
		this.yScale = d3.scaleTime().range([this.height, 0]);

		this.group = this.svg.append('g')
			.attr('transform', 'translate(' + margin / 2 + ',' + margin / 2 + ')');

		this.xScale.domain(this.chartData.map(d => d.date.split('-')[2]));
		this.yScale.domain(([this.parseTime('00:00'), d3.max(this.chartData, d => {
			const tempDate = this.parseTime('00:00');
			let totalTime = moment(this.parseTime('00:00'));
			d.works.map((work: Work) => {
				totalTime = moment(totalTime).add(moment.duration(+this.parseTime(work.spent) - +tempDate));
			});
			return totalTime.toDate();
		})]));

		this.xAxis = this.group.append('g')
			.attr('transform', 'translate(0,' + this.height + ')')
			.call(d3.axisBottom(this.xScale));

		this.yAxis = this.group.append('g')
			.call(d3.axisLeft(this.yScale).tickFormat(d3.timeFormat('%H:%M')));
	}

	private updateChart(): void {
		this.data.reverse();
		this.adaptData();
		console.log('Updating chart: ');
		console.log(this.chartData);
		// Update scales and axis

		this.xScale.domain(this.chartData.map(d => d.date.split('-')[2]));
		this.yScale.domain(([this.parseTime('00:00'), d3.max(this.chartData, d => d.totalTime)]));
		this.xAxis.transition().call(d3.axisBottom(this.xScale));
		this.yAxis.transition().call(d3.axisLeft(this.yScale).tickFormat(d3.timeFormat('%H:%M')));

		const bars = this.group.selectAll('.bar')
			.data(this.chartData);

		bars.selectAll('rect')
			.data(d => d)
			.enter().append('rect')
			.attr('x', d => this.xScale(d.date.split('-')[2]))
			.attr('y', d => this.yScale(this.parseTime(d)));

		// Remove existing bar
		// update.exit().remove();

		// Update existing bars
		this.svg.selectAll('.bars').transition()
			.attr('x', d => this.xScale(d.date.split('-')[2]))
			.attr('y', d => this.yScale(this.parseTime(d)))
			.attr('width', d => this.xScale.bandwidth())
			.attr('height', d => this.height - this.yScale(d.totalTime));

		// Add new bars
		bars
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.attr('x', d => this.xScale(d.date.split('-')[2]))
			.attr('y', d => this.height)
			.attr('width', this.xScale.bandwidth())
			.attr('height', 0)
			.transition()
			.attr('height', d => this.height - this.yScale(d.totalTime))
			.attr('y', d => this.yScale(d.totalTime));
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
						works: [work],
						totalTime: null
					})
				}
			} else {
				this.chartData.push({
					date: work.date,
					works: [work],
					totalTime: null
				})
			}
		});
		this.chartData.map((workChartData: WorkChartData) => {
			const tempDate = this.parseTime('00:00');
			let totalTime = moment(this.parseTime('00:00'));
			workChartData.works.map((work: Work) => {
				totalTime = moment(totalTime).add(moment.duration(+this.parseTime(work.spent) - +tempDate));
			});
			workChartData.totalTime = totalTime.toDate();
		});
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
