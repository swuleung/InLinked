import {Component} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-candidate-title-section-modal',
  templateUrl: './title-section-modal.component.html',
  styleUrls: ['./title-section-modal.component.scss']
})
export class TitleSectionModalComponent {
  closeResult: string;

  constructor(private modalService: NgbModal) {}

  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }
}
