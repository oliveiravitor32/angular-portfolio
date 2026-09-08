import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	HostListener,
	Input,
	OnDestroy,
	OnInit,
	Output,
	ViewChild,
} from '@angular/core';

@Component({
	selector: 'app-project-gallery-modal',
	templateUrl: './project-gallery-modal.component.html',
	styleUrls: ['./project-gallery-modal.component.css'],
})
export class ProjectGalleryModalComponent
	implements OnInit, AfterViewInit, OnDestroy
{
	@Input() images: string[] = [];
	@Input() title: string = '';
	@Input() startIndex: number = 0;

	@Output() closed = new EventEmitter<void>();
	@Output() indexChanged = new EventEmitter<number>();

	@ViewChild('closeButton') closeButton?: ElementRef<HTMLButtonElement>;

	currentIndex: number = 0;

	ngOnInit(): void {
		this.currentIndex = this.clampIndex(this.startIndex);
		document.body.classList.add('modal-open');
	}

	ngAfterViewInit(): void {
		this.closeButton?.nativeElement.focus();
	}

	ngOnDestroy(): void {
		document.body.classList.remove('modal-open');
	}

	get hasMultipleImages(): boolean {
		return this.images.length > 1;
	}

	close(): void {
		this.closed.emit();
	}

	previous(): void {
		this.goTo(this.currentIndex - 1);
	}

	next(): void {
		this.goTo(this.currentIndex + 1);
	}

	goTo(index: number): void {
		if (!this.images.length) {
			return;
		}
		const total = this.images.length;
		this.currentIndex = (index + total) % total;
		this.indexChanged.emit(this.currentIndex);
	}

	onBackdropClick(event: MouseEvent): void {
		if (event.target === event.currentTarget) {
			this.close();
		}
	}

	@HostListener('document:keydown', ['$event'])
	onKeydown(event: KeyboardEvent): void {
		switch (event.key) {
			case 'Escape':
				event.preventDefault();
				this.close();
				break;
			case 'ArrowLeft':
				if (this.hasMultipleImages) {
					event.preventDefault();
					this.previous();
				}
				break;
			case 'ArrowRight':
				if (this.hasMultipleImages) {
					event.preventDefault();
					this.next();
				}
				break;
		}
	}

	trackByIndex(index: number): number {
		return index;
	}

	private clampIndex(index: number): number {
		if (!this.images.length) {
			return 0;
		}
		return Math.min(Math.max(index, 0), this.images.length - 1);
	}
}
