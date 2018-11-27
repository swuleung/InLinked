import { Component, Output, EventEmitter } from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../services/user/user.service';
import { Enterprise } from '../../../models/enterprise';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-enterprise-fast-facts-section-modal',
  templateUrl: './fast-facts-section-modal.component.html',
  styleUrls: ['./fast-facts-section-modal.component.scss']
})
export class FastFactsSectionModalComponent {
  @Output() factsUpdateUser = new EventEmitter<boolean>();
  private modalRef: NgbModalRef;
  enterpriseHeadquarters: string;
  enterpriseCeo: string;
  enterpriseIndustry: string;
  enterpriseDescription: string;

  closeResult: string;

  constructor(private modalService: NgbModal, private user: UserService) { }

  open(content) {
    this.modalService.open(content, { size: 'lg' });
    this.populateForm();
  }

  populateForm() {
    if (this.user.enterpriseData) {
      const currUser = this.user.enterpriseData;
      this.enterpriseHeadquarters = currUser.headquarters;
      this.enterpriseCeo = currUser.ceo;
      this.enterpriseIndustry = currUser.industry;
      this.enterpriseDescription = currUser.enterpriseDescription;
    }
  }

  onSubmit(): void {
    const updatedUser: Enterprise = {
      userId: this.user.enterpriseData.userId,
      enterpriseId: this.user.enterpriseData.enterpriseId,
      username: this.user.enterpriseData.username,
      headline: this.user.enterpriseData.headline,
      email: this.user.enterpriseData.headline,
      profilePicture: this.user.enterpriseData.profilePicture,
      coverPhoto: this.user.enterpriseData.coverPhoto,
      acctype: 'enterprise',
      enterpriseName: this.user.enterpriseData.enterpriseName,
      enterpriseDescription: this.enterpriseDescription,
      ceo: this.enterpriseCeo,
      headquarters: this.enterpriseHeadquarters,
      industry: this.enterpriseIndustry
    };

    this.user.update(updatedUser).subscribe((res) => {
      if (res) {
        // Reload the user data before updating profile data
        this.user.loadCurrentUser(localStorage.getItem(environment.token_key)).subscribe((user) => {
          this.factsUpdateUser.emit(true);
          this.modalRef.close('Updated user');
        });
      } else {
        window.alert('Could not update profile');
      }
    });
  }

}
