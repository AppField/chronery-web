import { Component, ElementRef, Input, OnChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Work } from '../../models/work';
import * as moment from 'moment/moment';
import * as d3 from 'd3';
import { Router } from '@angular/router';

interface WorkChartData {
	date: string;
	works: Work[];
	totalTime: Date;
}

@Component({
	selector: 'chy-working-hours-chart',
	templateUrl: './working-hours-chart.component.html',
	styleUrls: ['./working-hours-chart.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class WorkingHoursChartComponent implements OnChanges {
	@ViewChild('chart') private chartContainer: ElementRef;
	@Input() data: Work[];
	private xScale: any;
	private yScale: any;

	private height: number;
	private width: number;
	private chartWidth: number;
	private chartHeight: number;
	private chartData: WorkChartData[];
	private svg: any;
	private group: any;
	private xAxis: any;
	private yAxis: any;
	private parseTime = d3.timeParse('%H:%M');
	private timeFormat = d3.timeFormat('%H:%M');

	constructor(private router: Router) {
	}

	ngOnChanges() {
		this.createBarChart();
	}

	createBarChart(): void {
		if (!this.data) {
			return
		}
		this.adaptData();
		const element = this.chartContainer.nativeElement;
		if (!this.svg) {
			this.svg = d3.select(element).append('svg');
		}
		const margin = {top: 65, right: 0, bottom: 20, left: 40};
		const chartHeight = '600px';

		// Dynamically calculated min Width of the chart, based on the amount of data.
		const barWidth = 40;
		const barPadding = 10;
		const minWidth = (barWidth + barPadding) * this.chartData.length + 'px';

		element.style.minWidth = minWidth;
		element.style.height = chartHeight;

		this.width = element.offsetWidth;
		this.height = element.offsetHeight;

		// Set Width and height of the svg.
		this.svg
			.attr('width', this.width)
			.attr('height', this.height);

		this.chartWidth = this.width - margin.left - margin.right;
		this.chartHeight = this.height - margin.top - margin.bottom;

		// Set the range (width and height) of the scales
		this.xScale = d3.scaleBand().range([0, this.chartWidth]).padding(0.2);
		this.yScale = d3.scaleTime().range([this.chartHeight, 0]);

		if (!this.group) {
			this.group = this.svg.append('g');
		}
		this.group.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		// Set the data of the scales
		this.xScale.domain(this.chartData.map(d => d.date.split('-')[2]));
		this.yScale.domain(([this.parseTime('00:00'), d3.max(this.chartData, d => d.totalTime)]));


		// Add the Scales/Axis to the svg
		if (!this.xAxis) {
			this.xAxis = this.group.append('g')
		}
		this.xAxis
			.attr('transform', 'translate(0,' + this.chartHeight + ')')
			.attr('class', 'none-select')
			.call(d3.axisBottom(this.xScale).tickFormat(d => d + '.'));

		if (!this.yAxis) {
			this.yAxis = this.group.append('g')
		}
		this.yAxis
			.call(d3.axisLeft(this.yScale).tickFormat(d3.timeFormat('%H:%M')))
			.attr('class', 'none-select');

		// Draw bars
		const bars = this.group.selectAll('.bar')
			.data(this.chartData);

		// Remove existing bar
		bars.exit().remove();

		// Update existing bars
		bars
			.attr('x', d => this.xScale(d.date.split('-')[2]))
			.attr('y', d => this.yScale(d.totalTime))
			.attr('width', d => this.xScale.bandwidth())
			.attr('height', d => this.chartHeight - this.yScale(d.totalTime));

		// Add new bars
		bars
			.enter()
			.append('rect')
			.attr('class', 'bar')
			.on('mouseover', (d, i: number, r) => {
				this.onMouseOver(d, i, r);
			})
			.on('mouseout', (d, i: number, r) => {
				this.onMouseOut(d, i, r);
			})
			.on('click', (d, i: number, r) => {
				this.onClick(d, i, r);
			})
			.attr('x', d => this.xScale(d.date.split('-')[2]))
			.attr('y', d => this.chartHeight)
			.attr('width', this.xScale.bandwidth())
			.attr('height', 0)
			.transition()
			.duration(400)
			.attr('height', d => this.chartHeight - this.yScale(d.totalTime))
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
		this.chartData.reverse();
	}

	private onMouseOver(d, i: number, bars) {
		// increase the size of the bars.
		d3.select(bars[i]).attr('class', 'highlight');
		d3.select(bars[i])
			.transition()
			.duration(400)
			.attr('width', this.xScale.bandwidth() + 10)
			.attr('x', () => this.xScale(d.date.split('-')[2]) - 5)
			.attr('y', () => this.yScale(d.totalTime) - 10)
			.attr('height', () => this.chartHeight - this.yScale(d.totalTime) + 10);

		// Show a tooltip
		const tooltipWidth = 130;
		const tooltipHeight = 35;
		this.group.append('rect')
			.attr('class', 'tooltip')
			.attr('opacity', 0)
			.attr('width', tooltipWidth)
			.attr('height', tooltipHeight)
			.attr('x', () => this.xScale(d.date.split('-')[2]) - (tooltipWidth - this.xScale.bandwidth()) / 2)
			.attr('y', () => this.yScale(d.totalTime) - 60)
			.transition()
			.duration(400)
			.attr('opacity', 1);

		this.group.append('text')
			.attr('class', 'tooltip-text')
			.style('text-anchor', 'middle')
			.attr('opacity', 0)
			.attr('x', () => this.xScale(d.date.split('-')[2]) + this.xScale.bandwidth() / 2)
			.attr('y', () => this.yScale(d.totalTime) - tooltipHeight - 2.5)
			.transition()
			.duration(400)
			.attr('opacity', 1)
			.text(() => [this.timeFormat(d.totalTime)]);
	}

	private onMouseOut(d, i: number, bars): void {
		// reduce the size of the bar to its actual size.
		d3.select(bars[i]).attr('class', 'bar');
		d3.select(bars[i])
			.transition()
			.duration(400)
			.attr('width', this.xScale.bandwidth())
			.attr('x', () => this.xScale(d.date.split('-')[2]))
			.attr('y', () => this.yScale(d.totalTime))
			.attr('height', () => this.chartHeight - this.yScale(d.totalTime));

		// hide the tooltip
		d3.selectAll('.tooltip')
			.transition()
			.duration(400)
			.attr('opacity', 0)
			.remove();

		d3.selectAll('.tooltip-text')
			.transition()
			.duration(400)
			.attr('opacity', 0)
			.remove();
	}

	// navigate to the clicked bar's date
	private onClick(d, i: number, bars): void {
		this.router.navigate(['working-hours', d.date]);
	}
}
