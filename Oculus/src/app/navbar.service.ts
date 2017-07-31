import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser'

@Injectable()
export class NavbarService {
  visible: boolean;
  public routeName: Subject<string> = new Subject<string>();

  constructor(private titleService: Title) { this.visible = true; }

  setName(name: string) {
    this.routeName.next(name);
    this.titleService.setTitle(name);
  }

  hide() { this.visible = false; }

  show() { this.visible = true; }

  toggle() { this.visible = !this.visible; }

}
