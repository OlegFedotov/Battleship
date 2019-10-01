import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  host: {
    '(contextmenu)' : "disableClick($event)"
  }
})
export class LayoutComponent implements OnInit{ 

  constructor(private _router: Router) {
       
  }

  ngOnInit() {
    // When application in browser is being refreshed always redirect to homepage
    this._router.navigate(['/home']);
  }

  public disableClick(event){
    // Prevent context menu on right click
    event.preventDefault();
  }

}
