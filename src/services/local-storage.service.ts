import { Data } from '../models/data.model';

export class LocalStorageService {

  setData(data: Data): void {
    localStorage.setItem('data', JSON.stringify(data));
  }

  getData(): Data {
    return JSON.parse(localStorage.getItem('data'));
  }

  setActiveFolderId(activeFolderId: string): void {
    localStorage.setItem('activeFolderId', activeFolderId);
  }

  getActiveFolderId(): string {
    return localStorage.getItem('activeFolderId');
  }
}
