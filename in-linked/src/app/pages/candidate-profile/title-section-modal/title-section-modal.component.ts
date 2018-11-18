import {Component} from '@angular/core';

import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-candidate-title-section-modal',
  templateUrl: './title-section-modal.component.html',
  styleUrls: ['./title-section-modal.component.scss']
})
export class TitleSectionModalComponent {
  private modalRef: NgbModalRef;
  private firstName = '';
  private lastName = '';
  private headline = '';
  private email = '';
  private displayEmail = 'yes-email';
  private currPassword = '';
  private newPassword = '';
  private newConfirm = '';
  private errorMessage = '';
  closeResult: string;

  constructor(
    private modalService: NgbModal,
    private user: UserService) {}

  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  onSubmit(): void {
    // Check if fields are valid, close on success
    if (this.newPassword !== this.newConfirm) {
      this.errorMessage = 'New password does not match the confirm password.';
    }
    let countEmpty = 0;
    for(let pw of [this.currPassword, this.newPassword, this.newConfirm]) {
      if (pw !== '') {
        countEmpty++;
      }
    }
    if (!(countEmpty === 0 || countEmpty === 3)) {
      this.errorMessage = 'Enter all three password fields to change password.';
    } else {

      // this.modalRef.close();
    }
  }
}
