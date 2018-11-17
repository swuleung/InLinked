import {Component, OnInit} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-candidate-experience-section-modal',
  templateUrl: './experience-section-modal.component.html',
  styleUrls: ['./experience-section-modal.component.scss']
})
export class ExperienceSectionModalComponent implements OnInit {
  closeResult: string;
  experienceForm: FormGroup;
  experiences: FormArray;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.experienceForm = this.formBuilder.group({
      experiences : this.formBuilder.array([ this.createExperience() ])
    });
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  createExperience(): FormGroup {
    return this.formBuilder.group({
      position: '',
      enterprise: '',
      enterpriseLocation: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      experienceDescription: ''
    });
  }

  addExperience(): void {
    this.experiences = this.experienceForm.get('experiences') as FormArray;
    this.experiences.push(this.createExperience());
  }

  removeExperience(experienceIndex): void {
    this.experiences = this.experienceForm.get('experiences') as FormArray;
    this.experiences.removeAt(experienceIndex);
  }
}
