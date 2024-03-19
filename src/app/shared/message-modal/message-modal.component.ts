import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'message-modal-content',
    templateUrl: './message-modal.component.html'
})
export class MessageModalComponent implements OnInit, OnDestroy {
    //@Input() name;
    @Input() message;
    @Input() isYesNo;
    @Input() functionName;
    @Input() title;
    @Input() btnConfirmTxt:string = this.translate.transform('buttons.delete');
    @Input() btnClass:string = "";




    constructor(public activeModal: NgbActiveModal,private translate: TranslatePipe
        ) { }
    ngOnInit() {


    }

    ngOnDestroy() { }


    close() {
        this.activeModal.close('Close click');
    }
    confirm() {

        this.activeModal.close("Confirm")
    }
}



