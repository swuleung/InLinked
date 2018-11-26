import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AuthUser } from '../../../models/auth-user';
import { UserService } from '../../../services/user/user.service';
import { environment } from '../../../../environments/environment';
import { Candidate } from '../../../models/candidate';

@Component({
  selector: 'app-candidate-skills-section-modal',
  templateUrl: './skills-section-modal.component.html',
  styleUrls: ['./skills-section-modal.component.scss']
})
export class SkillsSectionModalComponent implements OnInit {
  authUser: AuthUser;
  closeResult: string;
  modalRef: NgbModalRef;
  skillsForm: FormGroup;
  skills: FormArray;
  user: Candidate;

  @Input()
  skillsList: string[];
  @Output()
  skillsUpdateUser = new EventEmitter<boolean>();

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private userService: UserService) {}

  ngOnInit() {
    this.skillsForm = this.formBuilder.group({
      skills : this.formBuilder.array([ this.createSkill() ])
    });
    this.skills = this.skillsForm.get('skills') as FormArray;
    this.authUser = this.userService.decode(localStorage.getItem(environment.token_key));
  }

  open(content) {
    this.modalRef = this.modalService.open(content, { size: 'lg' });
    this.reloadFormArray();
    this.user = this.userService.getCorrespondingUserData() as Candidate;
    console.log(this.user);
  }

  createSkill(skill?: string): FormGroup {
    return this.formBuilder.group({
      skill: skill || '',
    });
  }

  addSkill(skill?: FormGroup): void {
    this.skills = this.skillsForm.get('skills') as FormArray;
    this.skills.push(skill || this.createSkill());
  }

  removeSkill(skillIndex): void {
    this.skills = this.skillsForm.get('skills') as FormArray;
    console.log(this.skills.at(skillIndex));
    this.skills.removeAt(skillIndex);
  }

  update(): boolean {
    // Build from list
    this.skillsList = [];
    for (let i = 0; i < this.skills.length; i++) {
      const skillRef = this.skills.at(i).value;
      this.skillsList.push(skillRef.skill);
    }
    this.user.skills = this.skillsList.join(',');
    this.userService.update(this.user).subscribe((res) => {
      console.log(res);
      if (res === true) {
        this.modalRef.close('Submitting update');
        this.skillsUpdateUser.emit(true);
      } else {
        window.alert('Could not update profile');
      }
    })
    return true;
  }

  reloadFormArray() {
    for (let i = this.skills.length - 1; i >= 0; i--) {
      this.skills.removeAt(i);
    }

    // Initialize form array with all these entries
    for (const skill of this.skillsList) {
      this.addSkill(this.createSkill(skill));
    }
  }
}
