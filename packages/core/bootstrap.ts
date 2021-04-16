import { DatabaseService } from '../common/services/database.service';
import { container } from './di/dependency-container';
import { Injectable } from './metadata/injectable';

export function createPlatform(): PlatformRef {
  const platformRef: PlatformRef = container.get(PlatformRef);
  return platformRef;
}

@Injectable()
class PlatformRef {
  constructor(private databaseService: DatabaseService) {}

  public bootstrap() {
    return new Promise((resolve, reject) => {
      this.databaseService.connect();
    });
  }
}
