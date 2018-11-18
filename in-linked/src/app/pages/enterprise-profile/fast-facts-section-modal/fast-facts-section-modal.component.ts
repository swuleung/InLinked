import { Component } from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-enterprise-fast-facts-section-modal',
  templateUrl: './fast-facts-section-modal.component.html',
  styleUrls: ['./fast-facts-section-modal.component.scss']
})
export class FastFactsSectionModalComponent {
  closeResult: string;

  constructor(private modalService: NgbModal) { }

  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  onSubmit(): void {
    // this.modalRef.close();
  }

}
