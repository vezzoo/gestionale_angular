import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  templateUrl: './section-title.component.html',
})
export class SectionTitleComponent {
  @Input() title: string;
}
