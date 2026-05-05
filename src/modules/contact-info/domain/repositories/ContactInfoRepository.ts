import { ContactInfo } from '../entities/ContactInfo';

export interface ContactInfoRepository {
  getContactInfo(): Promise<ContactInfo>;
  updateContactInfo(data: ContactInfo): Promise<ContactInfo>;
}
