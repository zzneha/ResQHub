
import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    standalone:true,
  selector: 'app-game-embed',
  template: '<iframe [src]="safeUrl" style="width: 100%; height: 100vh;"></iframe>',
  styles :''
})
export class GameEmbedComponent {
  @Input() gameUrl!: string;
  safeUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://gd.games/games/60e209e6-0f9f-446d-9983-d2f8fbd6d1ca');
  }
}
