import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[chyMaterialActive]'
})
export class MaterialActiveDirective {
  private clicked: boolean;

  @HostListener('mouseenter') onMouseEnter() {
    this.setMaterialClass(true);
  }

  @HostListener('mouseleave') onMouseLeaver() {
    if (!this.clicked) {
      this.setMaterialClass(false);
    }
  }

  @HostListener('click') onClick() {
    this.clicked = true;
    this.setMaterialClass(true);
  }

  @HostListener('document:click', ['$event.target'])
  public onClickOutside(targetElement) {
    const clickedInside = this.elRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clicked = false;
      this.setMaterialClass(false);
    }
  }

  constructor(private elRef: ElementRef) {

  }

  private setMaterialClass(isActive: boolean) {
    (isActive) ? this.elRef.nativeElement.classList.add('mat-elevation-z8') : this.elRef.nativeElement.classList.remove('mat-elevation-z8');
  }

}
