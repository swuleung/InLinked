import {Component, EventEmitter, Output} from '@angular/core';

import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { environment } from '../../../../environments/environment';
import { Enterprise } from '../../../models/enterprise';

@Component({
  selector: 'app-enterprise-title-section-modal',
  templateUrl: './title-section-modal.component.html',
  styleUrls: ['./title-section-modal.component.scss']
})
export class EnterpriseTitleSectionModalComponent {
  @Output() titleUpdateUser = new EventEmitter<boolean>();
  private modalRef: NgbModalRef;
  private enterpriseName = '';
  private headline = '';
  private email = '';
  private displayEmail = 'yes-email';
  private currPassword = '';
  private newPassword = '';
  private newConfirm = '';
  private errorMessage = '';
  closeResult: string;

  private selectedProfilePicture: File;
  private profilePictureEncoded: string;
  private selectedCoverPhoto: File;
  private coverPhotoEncoded: string;

  constructor(
    private modalService: NgbModal,
    private user: UserService) {}

  open(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    this.populateModal();
  }

  populateModal() {
    if (this.user.enterpriseData) {
      const currUser = this.user.enterpriseData;
      this.enterpriseName = currUser.enterpriseName;
      this.headline = currUser.headline;
      this.email = currUser.email;
    }
  }

  onProfilePictureChanged(event: any) {
    this.selectedProfilePicture = event.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(this.selectedProfilePicture);
    reader.onload = () => {
      this.profilePictureEncoded = 'data:image/png;base64,' + btoa(reader.result as any);
      console.log(this.profilePictureEncoded);
      this.user.enterpriseData.profilePicture = this.profilePictureEncoded;
    };
  }

  onCoverPhotoChanged(event: any) {
    this.selectedCoverPhoto = event.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(this.selectedProfilePicture);
    reader.onload = () => {
      this.coverPhotoEncoded = 'data:image/png;base64,' + btoa(reader.result as any);
      this.user.enterpriseData.profilePicture = this.coverPhotoEncoded;
    };
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
      const updatedUser: Enterprise = {
        userId: this.user.enterpriseData.userId,
        enterpriseId: this.user.enterpriseData.enterpriseId,
        username: this.user.enterpriseData.username,
        headline: this.headline,
        email: this.email,
        profilePicture: this.profilePictureEncoded,
        coverPhoto: this.coverPhotoEncoded,
        acctype: 'enterprise',
        enterpriseName: this.enterpriseName,
        enterpriseDescription: this.user.enterpriseData.enterpriseDescription,
        ceo: this.user.enterpriseData.ceo,
        headquarters: this.user.enterpriseData.headquarters,
        industry: this.user.enterpriseData.industry
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
          email: this.user.enterpriseData.email,
          oldPassword: this.currPassword,
          newPassword: this.newPassword,
          user: {
            role: 'User'
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
      } else {
        // No password update, just close
        this.modalRef.close('updated');
      }
    }
  }
}
