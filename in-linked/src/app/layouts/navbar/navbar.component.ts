import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { SearchService } from 'src/app/services/search/search.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
    selector: 'app-nav',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    private brandTitle = 'InLinked';
    private searchQuery = '';
    private status: boolean;

    @Input()
    profileName: string;
    @Input()
    profileType: string;

    constructor(
        private router: Router,
        private userService: UserService,
        private searchService: SearchService,
        private authService: AuthenticationService
    ) { }

    ngOnInit() {
        this.status = false;
        // this.profileName = this.userService.getCorrespondingUserData().username;
    }

    toggleNavbar() {
        this.status = !this.status;
    }

    onSubmit() {
        /* Do all searches in services and redirect to search page */
        this.searchService.searchAll(this.searchQuery);
        this.router.navigate(['/dashboard/search']);
    }

    logout() {
        this.authService.logout();
        window.location.href = '/dashboard';
    }
}

