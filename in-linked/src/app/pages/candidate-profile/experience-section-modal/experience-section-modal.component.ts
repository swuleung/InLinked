import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Experience } from '../../../models/experience';
import { ExperienceService } from '../../../services/experience/experience.service';
import { AuthUser } from '../../../models/auth-user';
import { UserService } from '../../../services/user/user.service';
import { environment } from '../../../../environments/environment';
import { delay } from 'q';
import { Observable } from 'rxjs';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-candidate-experience-section-modal',
  templateUrl: './experience-section-modal.component.html',
  styleUrls: ['./experience-section-modal.component.scss']
})
export class ExperienceSectionModalComponent implements OnInit {
  authUser: AuthUser;
  closeResult: string;
  modalRef: NgbModalRef;
  experienceForm: FormGroup;
  experiences: FormArray;
  
  experienceToUpdate: Set<number>; // List of experience ids already loaded (helps us determine which entries to send to server instead of the whole thing)
  experienceToRemove: Set<number>;

  @Input()
  experienceList: Experience[];
  @Output()
  experienceUpdateUser = new EventEmitter<boolean>();

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private userService: UserService, private experienceService: ExperienceService) {}

  ngOnInit() {
    this.experienceForm = this.formBuilder.group({
      experiences : this.formBuilder.array([ this.createExperience() ])
    });
    this.experiences = this.experienceForm.get('experiences') as FormArray;
    this.experienceToUpdate = new Set();
    this.experienceToRemove = new Set();
    this.authUser = this.userService.decode(localStorage.getItem(environment.token_key));
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    this.reloadFormArray();
    console.log(this.experienceToUpdate, this.experienceToRemove);
  }

  createExperience(id?: number, position?: string, enterprise?: string, enterpriseLocation?: string, startMonth?: number, startYear?: number, endMonth?: number, endYear?: number, experienceDescription?: string): FormGroup {
    return this.formBuilder.group({
      expdata: id || 0,
      position: position || '',
      enterprise: enterprise || '',
      enterpriseLocation: enterpriseLocation || '',
      startMonth: startMonth || '',
      startYear: startYear || '',
      endMonth: endMonth || '',
      endYear: endYear || '',
      experienceDescription: experienceDescription || ''
    });
  }

  addExperience(experience?: FormGroup): void {
    this.experiences = this.experienceForm.get('experiences') as FormArray;
    this.experiences.push(experience || this.createExperience());
  }

  removeExperience(experienceIndex): void {
    this.experiences = this.experienceForm.get('experiences') as FormArray;
    const formData = this.experiences.at(experienceIndex).value;
    if (formData.expdata === 0) {
      this.experiences.removeAt(experienceIndex);
      return;
    }
    
    this.experienceToUpdate.delete(formData.expdata);
    this.experienceToRemove.add(formData.expdata);

    console.log(this.experienceToUpdate, this.experienceToRemove);
    this.experiences.removeAt(experienceIndex);
  }

  update(): boolean {
    // Delete entries marked for removal
    const observables: Observable<any>[] = [];
    this.experienceToRemove.forEach(id => {
      // Delete
      observables.push(this.experienceService.delete(id));
    });

    // Go through the form array, update and creating when needed
    for (let i = 0; i < this.experiences.length; i++) {
      const expRef = this.experiences.at(i).value;

      if (this.experienceToUpdate.has(expRef.expdata)) {
        // Update
        observables.push(this.experienceService.update(expRef.expdata, expRef.position, expRef.enterprise, Number(expRef.startMonth),  Number(expRef.startYear),  Number(expRef.endMonth),  Number(expRef.endYear), expRef.experienceDescription, expRef.enterpriseLocation));
      } else {
        // Add
        // These services return boolean, use values to display errors
        observables.push(this.experienceService.create(
          this.authUser.id,
          expRef.position,
          expRef.enterprise,
          Number(expRef.startMonth),
          Number(expRef.startYear),
          null,
          expRef.experienceDescription,
          Number(expRef.endMonth),
          Number(expRef.endYear),
          expRef.enterpriseLocation
        ));
      }
    }

    // Run all the requests
    forkJoin(observables).subscribe(res => {
      // Check if all requests passed
      for (const bool of res) {
        if (!bool) {
          alert('Unable to perform an update request.')
        }
      }

      this.modalRef.close('Submitting update');
      this.experienceUpdateUser.emit(true);
    });
    return true;
  }

  reloadFormArray() {
    for (let i = this.experiences.length - 1; i >= 0; i--) {
      this.experiences.removeAt(i);
    }
    this.experienceToUpdate.clear();
    this.experienceToRemove.clear();

    // Initialize form array with all these entries
    for (const exp of this.experienceList) {
      this.experienceToUpdate.add(exp.experienceId); // Add to list of experiences to update
      this.addExperience(this.createExperience(
        exp.experienceId,
        exp.positionName,
        exp.enterpriseName,
        exp.location,
        exp.startMonth,
        exp.startYear,
        exp.endMonth,
        exp.endYear,
        exp.description
      ));
    }
  }
}
