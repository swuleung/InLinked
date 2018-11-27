import { Component, Output, EventEmitter } from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { Enterprise } from '../../../models/enterprise';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-enterprise-delete-modal',
  templateUrl: './enterprise-delete-modal.component.html',
  styleUrls: ['./enterprise-delete-modal.component.scss']
})
export class EnterpriseDeleteModalComponent {
  private modalRef: NgbModalRef;
  username: string;
  enteredUsername: string;
  closeResult: string;

  constructor(private modalService: NgbModal, private user: UserService) { }

  open(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    this.populateForm();
  }

  populateForm() {
    if (this.user.enterpriseData) {
      const currUser = this.user.enterpriseData;
      this.username = currUser.username;
    }
  }

  onSubmit(): void {
      this.user.delete(this.user.enterpriseData.userId).subscribe((res) => {
        if (res) {
            this.modalRef.close('Deleted user');
            // TODO Logout of account after deleting
        } else {
            window.alert('Could not delete user');
        }
      });
  }

}
