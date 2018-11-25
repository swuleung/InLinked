import {Component, Output, EventEmitter} from '@angular/core';

import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { Candidate } from 'src/app/models/candidate';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-candidate-title-section-modal',
  templateUrl: './title-section-modal.component.html',
  styleUrls: ['./title-section-modal.component.scss']
})
export class TitleSectionModalComponent {
  @Output() titleUpdateUser = new EventEmitter<boolean>();
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
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    this.populateModal();
  }

  populateModal() {
    if (this.user.candidateData) {
      const currUser = this.user.candidateData;
      const name = currUser.fullName.split(' ');
      this.firstName = name[0] ? name[0] : '';
      this.lastName = name[1] ? name[1] : '';
      this.headline = currUser.headline;
      this.email = currUser.email;
      this.displayEmail = currUser.displayEmail ? 'yes-email' : 'no-email';
    }
  }

  onSubmit(): void {
    // Check if fields are valid, close on success
    if (this.newPassword !== this.newConfirm) {
      this.errorMessage = 'New password does not match the confirm password.';
    }
    let countEmpty = 0;
    for(const pw of [this.currPassword, this.newPassword, this.newConfirm]) {
      if (pw !== '') {
        countEmpty++;
      }
    }
    if (!(countEmpty === 0 || countEmpty === 3)) {
      this.errorMessage = 'Enter all three password fields to change password.';
    } else {
      const updatedUser: Candidate = {
        userId: this.user.candidateData.userId,
        candidateId: this.user.candidateData.candidateId,
        username: this.user.candidateData.username,
        headline: this.headline,
        email: this.email,
        profilePicture: this.user.candidateData.profilePicture,
        coverPhoto: this.user.candidateData.coverPhoto,
        role: 'user',
        acctype: 'candidate',
        fullName: this.firstName + ' ' + this.lastName,
        skills: this.user.candidateData.skills,
        educationLevel: this.user.candidateData.educationLevel,
        displayEmail: this.displayEmail === 'yes-email' ? 1 : 0
      };
      this.user.update(updatedUser).subscribe((res) => {
        if (res) {
          this.user.loadCurrentUser(localStorage.getItem(environment.token_key)).subscribe((user) => {
            this.titleUpdateUser.emit(true);
          });
        } else {
          window.alert('Could not update profile');
        }
      });

      // Update password if needed
      if (countEmpty === 3) {
        const passwordPayload = {
          email: this.user.candidateData.email,
          oldPassword: this.currPassword,
          newPassword: this.newPassword,
          user: {
            role: this.user.candidateData.role
          }
        };
        this.user.changePassword(passwordPayload).subscribe((res: boolean) => {
          console.log(res);
          if (res === true) {
            this.user.loadCurrentUser(localStorage.getItem(environment.token_key)).subscribe((user) => {
              this.modalRef.close('updated');
              // this.titleUpdateUser.emit(true);
            });
          } else {
            window.alert('Could not change password');
          }
        });
      }
    }
  }
}
