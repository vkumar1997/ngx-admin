import { Component, HostListener, ViewChild, ElementRef, AfterViewInit, OnInit} from '@angular/core';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import {Subject, Observable} from 'rxjs';
import { HttpClient } from  '@angular/common/http';
import { HttpService } from '../../../http.service';
import * as faceapi from './face-api'

@Component({
  selector: 'ngx-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
  providers: [HttpService]
})

export class DatepickerComponent implements AfterViewInit, OnInit{
	public showWebcam = true;
	public allowCameraSwitch = true;	
	public webcamImageSrc: string = "assets/images/upload_icon.png";
	public errors: WebcamInitError[] = [];
	private width: number;
	private height: number;
	public multipleWebcamsAvailable = false;
	public deviceId: string;
	public employees: any;
	constructor(
	private httpService: HttpService)
	{}


	public videoOptions: MediaTrackConstraints = {
	// width: {ideal: 1024},
	// height: {ideal: 576}
	};

	private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

	@ViewChild('webcamcard', { read: ElementRef, static:false })
	  webcamcard: ElementRef;

	public ngOnInit(): void {
		WebcamUtil.getAvailableVideoInputs()
		.then((mediaDevices: MediaDeviceInfo[]) => {
			this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
		});
		this.httpService.getEmployees().subscribe(
		(employees) => { 
			this.employees = employees;
		 },
		(error) => { console.log(error); });

		
	}

	ngAfterViewInit(){
		this.width = this.webcamcard.nativeElement.offsetWidth;
		this.height = this.webcamcard.nativeElement.offsetHeight;
	}

	private trigger: Subject<void> = new Subject<void>();
	
	triggerSnapshot(): void {
		this.trigger.next();
	}
	
	handleImage(webcamImage: WebcamImage): void {
		console.info('Saved webcam image', webcamImage);
		this.webcamImageSrc = webcamImage.imageAsDataUrl;
	}

	public showNextWebcam(directionOrDeviceId: boolean|string): void {
		this.nextWebcam.next(directionOrDeviceId);
	}

	public handleInitError(error: WebcamInitError): void {
		this.errors.push(error);
	}

	@HostListener('window:resize', ['$event'])
	  onResize(event?: Event) {
	    this.width = this.webcamcard.nativeElement.offsetWidth;
	    this.height = this.webcamcard.nativeElement.offsetHeight;
	  }

	public get triggerObservable(): Observable<void> {
		return this.trigger.asObservable();
	}

	public get nextWebcamObservable(): Observable<boolean|string> {
		return this.nextWebcam.asObservable();
	}

	public cameraWasSwitched(deviceId: string): void {
		console.log('active device: ' + deviceId);
		this.deviceId = deviceId;

		console.log(this.multipleWebcamsAvailable);
	}

	
  
}
