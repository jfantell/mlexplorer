import { Component, OnInit, Input, HostListener } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() experiment;
	@HostListener('window:resize', ['$event'])
	onResize(event) {
	}
	canvas: any;
	ctx: any;

	//Source: https://stackoverflow.com/questions/1484506/random-color-generator
	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
		  color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	  }

	create_datasets(){
		var dataset_labels = ['loss','val_loss','accuracy','val_accuracy'];
		var datasets = [];
		for(var l of dataset_labels){
			var yAxisID;
			if(l.includes('loss')){
				yAxisID = 'loss';
			} else {
				yAxisID = 'accuracy';
			}
			datasets.push({label: l, xAxisID: 'epoch', yAxisID: yAxisID, borderColor: this.getRandomColor(), data: this.experiment[l], fill: false})
		}
		return datasets
	}


	create_epoch_labels(lowEnd=0,highEnd=5){
		var list = [];
		for (var i = lowEnd; i <= highEnd; i++) {
    		list.push(i);
		}
		return list
	}

	initialize_loss_accuracy_chart(){
		Chart.defaults.global.defaultFontSize = 15;
		this.canvas = document.getElementById('chart');
		this.ctx = this.canvas.getContext('2d');
		var datasets = this.create_datasets();
		var labels = this.create_epoch_labels(0,datasets[0].data.length-1);
		let myChart = new Chart(this.ctx, {
			type: 'line',
			data: {
				labels: labels,
				datasets: datasets
			},
			options: {
				tooltips: {
					mode: 'nearest',
					intersect: false,
				},
				// responsive: true,
   				// maintainAspectRatio: true, 
				display: true,
				scales: {
					xAxes: [{
						id: 'epoch',
						display: true,
						scaleLabel: {
							display: true,
							labelString: 'epoch'
						},
					}],
					yAxes: [{
							id: 'loss',
							type: 'linear',
							position: 'left',
							scaleLabel: {
								display: true,
								labelString: 'loss'
							}
						},
						{
							id: 'accuracy',
							type: 'linear',
							position: 'right',
							scaleLabel: {
								display: true,
								labelString: '% accuracy'
							},
						}]
				},
				title: {
					display: true,
					align: 'center',
					position: 'top',
					text: 'Loss and Accuracy Graph'
				},
			}	
		});
	}
	
	/* Constructor, needed to get @Injectables */
	// constructor(private element : ElementRef) {
	// 	this.host = d3.select(this.element.nativeElement);
	// }		

	ngOnInit() {
	}

	ngAfterViewInit(){
		this.initialize_loss_accuracy_chart();
	}

}
