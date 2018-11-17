import {Component, OnInit} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-candidate-skills-section-modal',
  templateUrl: './skills-section-modal.component.html',
  styleUrls: ['./skills-section-modal.component.scss']
})
export class SkillsSectionModalComponent implements OnInit {
  closeResult: string;
  skillsForm: FormGroup;
  skills: FormArray;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.skillsForm = this.formBuilder.group({
      skills : this.formBuilder.array([ this.createSkill() ])
    });
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  createSkill(): FormGroup {
    return this.formBuilder.group({
      skill: '',
    });
  }

  addSkill(): void {
    this.skills = this.skillsForm.get('skills') as FormArray;
    this.skills.push(this.createSkill());
  }

  removeSkill(skillIndex): void {
    this.skills = this.skillsForm.get('skills') as FormArray;
    this.skills.removeAt(skillIndex);
  }
}
