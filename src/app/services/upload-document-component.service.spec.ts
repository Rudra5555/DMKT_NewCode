import { TestBed } from '@angular/core/testing';

import { UploadDocumentComponentService } from './upload-document-component.service';

describe('UploadDocumentComponentService', () => {
  let service: UploadDocumentComponentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadDocumentComponentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
