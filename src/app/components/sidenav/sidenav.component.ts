import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { state, style, trigger } from '@angular/animations';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'chy-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    animations: [
        trigger('menuState', [
            state('open', style({ opacity: 1 })),
            state('close', style({ opacity: 0, width: '0px', display: 'none' }))
            // transition('* => *', [
            // 	animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')
            // ])
        ])
    ]
})

export class SidenavComponent implements OnInit, OnDestroy {
    state = 'open';
    @ViewChild('sidenavContainer') private sidenav;
    private destroy$: Subject<boolean> = new Subject<boolean>();
    private mediaSub: Subscription;

    constructor(private media: ObservableMedia) {
    }

    get isMobile(): boolean {
        return this.media.isActive('xs');
    }

    ngOnInit() {
        this.state = (this.media.isActive('xs')) ? 'close' : 'open';
        this.mediaSub = this.media
            .subscribe(media => {
                this.state = (media.mqAlias === 'xs') ? 'close' : 'open';
            });
    }

    toggleCollapse(): void {
        this.state = (this.state === 'open') ? 'close' : 'open';
    }

    recollapseNav(): void {
        if (this.isMobile) {
            this.state = 'close';
        }
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
        this.mediaSub.unsubscribe();
    }
}
