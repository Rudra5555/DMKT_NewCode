import { HttpClientModule } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgxEditorModule } from 'ngx-editor';
import { NgxMaskModule } from 'ngx-mask';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { ClipboardModule } from 'ngx-clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ToastrModule } from 'ngx-toastr';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LightboxModule } from 'ngx-lightbox';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatSliderModule } from '@angular/material/slider';
import {MatChipsModule} from '@angular/material/chips';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ToastModule } from 'primeng/toast';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    FormsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    BsDatepickerModule.forRoot(),
    MatSelectModule,
    TimepickerModule.forRoot(),
    MatTooltipModule,
    NgxMaskModule.forRoot({
      showMaskTyped: false,
    }),
    NgxEditorModule,
    NgScrollbarModule,
    ClipboardModule,
    DragDropModule,
    ScrollingModule,
    ToastrModule.forRoot({
      timeOut:1000,
      progressBar:true,
      progressAnimation:'increasing',
      preventDuplicates:true

    }),
    MatStepperModule,
    MatProgressBarModule,
    LightboxModule,
    TooltipModule.forRoot(),
    NgChartsModule.forRoot(),
    NgApexchartsModule,
    MatSliderModule,
    MatChipsModule,
    CarouselModule ,
    ToastModule,
    NgxDropzoneModule,
    MatAutocompleteModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    BsDatepickerModule,
    MatSelectModule,
    TimepickerModule,
    NgxMaskModule,
    NgScrollbarModule,
    ClipboardModule,
    DragDropModule,
    ScrollingModule,
    ToastrModule,
    MatStepperModule,
    MatProgressBarModule,
    LightboxModule,
    TooltipModule,
    NgChartsModule,
    NgApexchartsModule,
    NgxEditorModule,
    MatSliderModule,
    MatChipsModule,
    CarouselModule ,
    ToastModule,
    NgxDropzoneModule,
    MatAutocompleteModule,
    MatTooltipModule
  ],

  providers: [BsDatepickerConfig,DatePipe],
})
export class SharedModule {}
