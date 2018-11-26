import {Component, EventEmitter, Output} from '@angular/core';

import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-enterprise-title-section-modal',
  templateUrl: './title-section-modal.component.html',
  styleUrls: ['./title-section-modal.component.scss']
})
export class EnterpriseTitleSectionModalComponent {
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

  private selectedProfilePicture: File;
  private profilePictureEncoded: string;
  private selectedCoverPhoto: File;
  private coverPhotoEncoded: string;

  constructor(
    private modalService: NgbModal,
    private user: UserService) {}

  open(content) {
    this.modalService.open(content, { size: 'lg' });
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
      // this.modalRef.close();
    }
}
