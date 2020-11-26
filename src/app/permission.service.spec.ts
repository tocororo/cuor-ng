import { TestBed } from '@angular/core/testing';

import { CuratorPermissionService } from './permission.service';

describe('PermissionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CuratorPermissionService = TestBed.get(CuratorPermissionService);
    expect(service).toBeTruthy();
  });
});
