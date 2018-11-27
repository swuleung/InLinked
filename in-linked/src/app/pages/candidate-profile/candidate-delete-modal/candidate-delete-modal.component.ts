import { Component, Output, EventEmitter } from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { AuthenticationService } from '../../../services/authentication/authentication.service';
import { environment } from '../../../../environments/environment';
@Component({
    selector: 'app-candidate-delete-modal',
    templateUrl: './candidate-delete-modal.component.html',
    styleUrls: ['./candidate-delete-modal.component.scss']
})
export class CandidateDeleteModalComponent {
    private modalRef: NgbModalRef;
    username: string;
    enteredUsername: string;
    closeResult: string;

    constructor(
        private modalService: NgbModal,
        private user: UserService,
        private authService: AuthenticationService
    ) { }

    open(content) {
        this.modalRef = this.modalService.open(content, { size: 'lg' });
        this.populateForm();
    }

    populateForm() {
        if (this.user.candidateData) {
            const currUser = this.user.candidateData;
            this.username = currUser.username;
        }
    }

    onSubmit(): void {
        this.user.delete(this.user.candidateData.userId).subscribe((res) => {
            if (res) {
                this.modalRef.close('Deleted user');
                this.authService.logout();
                window.location.href = '/login';
            } else {
                window.alert('Could not delete user');
            }
        });
    }

}
