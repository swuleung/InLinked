import {Component, OnInit, Input} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Experience } from '../../../models/experience';

@Component({
  selector: 'app-candidate-experience-section-modal',
  templateUrl: './experience-section-modal.component.html',
  styleUrls: ['./experience-section-modal.component.scss']
})
export class ExperienceSectionModalComponent implements OnInit {
  closeResult: string;
  experienceForm: FormGroup;
  experiences: FormArray;
  experienceIndices: number[]; // List of experience ids already loaded (helps us determine which entries to send to server instead of the whole thing)

  @Input()
  experienceList: Experience[];

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.experienceForm = this.formBuilder.group({
      experiences : this.formBuilder.array([ this.createExperience() ])
    });
    this.experiences = this.experienceForm.get('experiences') as FormArray;
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' });
    console.log(this.experienceList);
    console.log(this.experiences);

    this.reloadFormArray();
  }

  createExperience(position?: string, enterprise?: string, enterpriseLocation?: string, startMonth?: number, startYear?: number, endMonth?: number, endYear?: number, experienceDescription?: string): FormGroup {
    return this.formBuilder.group({
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
    this.experiences.removeAt(experienceIndex);
  }

  reloadFormArray() {
    for (let i = this.experiences.length - 1; i >= 0; i--) {
      this.experiences.removeAt(i);
    }

    // Initialize form array with all these entries
    for (const exp of this.experienceList) {
      this.addExperience(this.createExperience(
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
