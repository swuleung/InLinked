import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AuthUser } from '../../../models/auth-user';
import { Education } from '../../../models/education';
import { UserService } from '../../../services/user/user.service';
import { environment } from '../../../../environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { EducationService } from '../../../services/education/education.service';

@Component({
  selector: 'app-candidate-education-section-modal',
  templateUrl: './education-section-modal.component.html',
  styleUrls: ['./education-section-modal.component.scss']
})
export class EducationSectionModalComponent implements OnInit {
  authUser: AuthUser;
  closeResult: string;
  modalRef: NgbModalRef;
  educationForm: FormGroup;
  educations: FormArray;

  educationToUpdate: Set<number>;
  educationToRemove: Set<number>;

  @Input()
  educationList: Education[];
  @Output()
  educationUpdateUser = new EventEmitter<boolean>();

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private userService: UserService, private educationService: EducationService) {}

  ngOnInit() {
    this.educationForm = this.formBuilder.group({
      educations : this.formBuilder.array([ this.createEducation() ])
    });
    this.educations = this.educationForm.get('educations') as FormArray;
    this.educationToUpdate = new Set();
    this.educationToRemove = new Set();
    this.authUser = this.userService.decode(localStorage.getItem(environment.token_key));
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    this.reloadFormArray();
    console.log(this.educationToUpdate, this.educationToRemove);
  }

  createEducation(educationId?: number, degree?: string, school?: string, schoolLocation?: string, startMonth?: number, startYear?: number, endMonth?: number, endYear?: number): FormGroup {
    return this.formBuilder.group({
      edudata: educationId || 0,
      degree: degree || '',
      school: school || '',
      schoolLocation: schoolLocation || '',
      startMonth: startMonth || '',
      startYear: startYear || '',
      endMonth: endMonth || '',
      endYear: endYear || '',
    });
  }

  addEducation(education?: FormGroup): void {
    this.educations = this.educationForm.get('educations') as FormArray;
    this.educations.push(education || this.createEducation());
  }

  removeEducation(educationIndex): void {
    this.educations = this.educationForm.get('educations') as FormArray;
    const formData = this.educations.at(educationIndex).value;
    
    this.educationToUpdate.delete(formData.edudata);
    this.educationToRemove.add(formData.edudata);

    console.log(this.educationToUpdate, this.educationToRemove);
    this.educations.removeAt(educationIndex);
  }

  update(): boolean {
    const observables: Observable<any>[] = [];
    this.educationToRemove.forEach(id => {
      // Delete
      observables.push(this.educationService.delete(id));
    });

    // Go through form array, update and creating when needed
    for (let i = 0; i < this.educations.length; i++) {
      const eduRef = this.educations.at(i).value;

      if (this.educationToUpdate.has(eduRef.edudata)) {
        // Update
        observables.push(this.educationService.update(eduRef.edudata, this.authUser.id, eduRef.school, eduRef.startMonth, eduRef.startYear, eduRef.schoolLocation, eduRef.endMonth, eduRef.endYear, eduRef.degree));
      } else {
        // Add
        // These services return boolean, use values to display errors
        observables.push(this.educationService.create(
          this.authUser.id,
          eduRef.school,
          Number(eduRef.startMonth),
          Number(eduRef.startYear),
          eduRef.schoolLocation,
          Number(eduRef.endMonth),
          Number(eduRef.endYear),
          eduRef.degree
        ));
      }
    }

    // Run all requests
    forkJoin(observables).subscribe(res => {
      // Check if all requests passed
      for (const bool of res) {
        if (!bool) {
          alert('Unable to perform an update request.')
        }
      }

      this.modalRef.close('Submitting update');
      this.educationUpdateUser.emit(true);
    });

    return true;
  }

  reloadFormArray() {
    for (let i = this.educations.length - 1; i >= 0; i--) {
      this.educations.removeAt(i);
    }
    this.educationToUpdate.clear();
    this.educationToRemove.clear();

    // Initialize form array with all these entries
    for (const edu of this.educationList) {
      this.educationToUpdate.add(edu.educationId); // Add to list of experiences to update
      this.addEducation(this.createEducation(
        edu.educationId,
        edu.degree,
        edu.schoolName,
        edu.location,
        edu.startMonth,
        edu.startYear,
        edu.endMonth,
        edu.endYear,
      ));
    }
  }
}
