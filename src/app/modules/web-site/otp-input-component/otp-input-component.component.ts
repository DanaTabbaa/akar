import { Component, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-otp-input-component',
  templateUrl: './otp-input-component.component.html',
  styleUrls: ['./otp-input-component.component.scss']
})
export class OtpInputComponentComponent{
  otp: string[] = ['', '', '', ''];
  @Output() dataEvent = new EventEmitter<any>();
  constructor() { }
  @Output() otpEntered: EventEmitter<string> = new EventEmitter<string>();
  ngOnInit(): void {
  }
  onCodeInput(index: number) {
    const value = this.otp[index].trim();
    if (value !== '') {
      if (index < this.otp.length - 1) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      } else {
        this.otpEntered.emit(this.otp.join(''));
      }
    }
    console.log('value',this.otp);
    
  }
}

