import { UnauthGuard } from './unauth.guard';

describe('UnauthGuard', () => {
  it('should be defined', () => {
    expect(new UnauthGuard()).toBeDefined();
  });
});
