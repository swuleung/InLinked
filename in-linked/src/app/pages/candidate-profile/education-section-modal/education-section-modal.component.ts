import {Component, OnInit} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-candidate-education-section-modal',
  templateUrl: './education-section-modal.component.html',
  styleUrls: ['./education-section-modal.component.scss']
})
export class EducationSectionModalComponent implements OnInit {
  closeResult: string;
  educationForm: FormGroup;
  educations: FormArray;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.educationForm = this.formBuilder.group({
      educations : this.formBuilder.array([ this.createEducation() ])
    });
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  createEducation(): FormGroup {
    return this.formBuilder.group({
      degree: '',
      school: '',
      schoolLocation: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      educationDescription: ''
    });
  }

  addEducation(): void {
    this.educations = this.educationForm.get('educations') as FormArray;
    this.educations.push(this.createEducation());
  }

  removeEducation(educationIndex): void {
    this.educations = this.educationForm.get('educations') as FormArray;
    this.educations.removeAt(educationIndex);
  }
}
